import externalConnectionsService from '../externalConnections/externalConnections-service.js';
import projectModel from './project-model.js';

class projectServices {
  async setStatusList(projectId, statuses) {
    const user = await projectModel.findOneAndUpdate(
      { projectId: projectId },
      {
        statuses: statuses,
      }
    );
    if (!user) {
      const project = await new projectModel({
        projectId,
        statuses: statuses,
      });
      await project.save();
    }

    return user;
  }

  async getStatusList(projectId) {
    const { statuses } = await projectModel.find({ projectId });
    return statuses;
  }
}

export default new projectServices();
