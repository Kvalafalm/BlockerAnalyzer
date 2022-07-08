/* const jiraConnections = require('../externalConnections/jiraConnections'); */
import BlockerServices from './Blocker-services.js';

class BlockerController {
  async getList(req, res, next) {
    try {
      const { id } = req?.params;
      let result;
      if (id) {
        result = await BlockerServices.getBlockersList(id);
      }
      await res.status(200).json({
        result,
      });
    } catch (e) {
      next(e);
    }
  }
  async setBlocker(req, res, next) {
    try {
      //project;
      const blocker = await BlockerServices.setBlocker(req?.body?.document);
      await res.status(200).json({
        result: blocker,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new BlockerController();
