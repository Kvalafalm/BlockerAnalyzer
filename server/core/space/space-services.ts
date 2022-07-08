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

  async updateOrCreateSpace(projectId: string, body): Promise<boolean> {
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
}

export default new spaceServices();
