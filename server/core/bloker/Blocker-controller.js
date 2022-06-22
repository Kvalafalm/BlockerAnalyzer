/* const jiraConnections = require('../externalConnections/jiraConnections'); */
import BlockerServices from './Blocker-services.js';

class BlockerController {
  async getList(req, res, next) {
    try {
      //project;
      const dataList = await BlockerServices.getBlockersList();
      await res.status(200).json({
        result: dataList,
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
