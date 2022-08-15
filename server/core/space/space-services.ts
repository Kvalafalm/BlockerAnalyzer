import { ISpace } from '../../../client/src/store/app/interface';
import spaceModel from './space-model';
import spacesView, { Space } from './space-view';

class spaceServices {
  async updateSpace(projectId: string, body): Promise<boolean> {
    const projectUpdated = await spaceModel.findOneAndUpdate(
      { projectId: projectId },
      {
        ...body,
      }
    );
    if (!projectUpdated) {
      const project = await new spaceModel({
        projectId,
        ...body,
      });
      await project.save();
    }

    return true;
  }

  async updateOrCreateSpace(externalId: string, body): Promise<boolean> {
    const projectUpdated = await spaceModel.findOneAndUpdate(
      { externalId },
      {
        ...body,
      }
    );
    if (!projectUpdated) {
      const project = await new spaceModel({
        externalId,
        ...body,
      });
      await project.save();
    }

    return true;
  }

  async UpdateLastRequest(
    externalId: string,
    request: any
  ): Promise<boolean> {

    const SpaceUpdated = await spaceModel.findOneAndUpdate(
      { externalId: externalId },
      {
        lastRequest: request
      }
    );

    return true;
  }

  async getStatusList(projectId: string): Promise<any> {
    const { statuses } = await spaceModel.findOne({ projectId }) as Space;
    return statuses;
  }

  async getSpaceByExternalId(id: string): Promise<Space> {
    const document = await spaceModel.findOne({ externalId: id });
    return document;
  }

  async getSpaceList(): Promise<Space[]> {
    const documents = await spaceModel.find();
    const data = await spacesView.prepareArrayOfSpaces(documents);
    return data;
  }

  async compareImportedSpacesAndExternalSpaces(projects: ISpace[]): Promise<ISpace[]> {
    const importedSpaces = await this.getSpaceList();

    if (importedSpaces && importedSpaces.length > 0) {
      for (const space of importedSpaces) {
        for (const externalSpace of projects) {
          if (externalSpace.externalId == space.externalId?.toString()) {
            externalSpace.imported = true
            externalSpace.id = space.id
          }
        }
      }
    }
    return projects
  }

  async deleteSpace(id: string): Promise<boolean> {
    const result = await spaceModel.findByIdAndDelete(id)
    return result
  }
}

export default new spaceServices();
