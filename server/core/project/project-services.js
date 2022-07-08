import projectModel from './project-model.js';
import spacesView from './space-view.js';

class projectServices {
  async updateProject(projectId, body) {
    const projectUpdated = await projectModel.findOneAndUpdate(
      { projectId: projectId },
      {
        ...body,
      }
    );
    if (!projectUpdated) {
      const project = await new projectModel({
        projectId,
        ...body,
      });
      await project.save();
    }

    return user;
  }

  async updateOrCreateProject(projectId, body) {
    const projectUpdated = await projectModel.findOneAndUpdate(
      { projectId: projectId },
      {
        ...body,
      }
    );
    if (!projectUpdated) {
      const project = await new projectModel({
        projectId,
        ...body,
      });
      await project.save();
    }

    return user;
  }

  async getStatusList(projectId) {
    const { statuses } = await projectModel.find({ projectId });
    return statuses;
  }

  async getProjectByExternalId(id) {
    const documents = await projectModel.findOne({ externalId: id });
    return documents;
  }

  async getProjectList() {
    const documents = await projectModel.find();
    const data = await spacesView.prepareArrayOfSpaces(documents);
    return data;
  }
}

export default new projectServices();
