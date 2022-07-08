/* const jiraConnections = require('../externalConnections/jiraConnections'); */
import projectServices from './project-services.js';

class projectController {
  async getProjectList(req, res, next) {
    try {
      const result = await projectServices.getProjectList();

      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new projectController();
