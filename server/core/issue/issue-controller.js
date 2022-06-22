/* const jiraConnections = require('../externalConnections/jiraConnections'); */
import ApiError from '../../utils/exceptions/api_error.js';
import issueServices from './issue-services.js';

class issueController {
  async getIssue(req, res, next) {
    try {
      const { id } = req?.params;
      if (!id) {
        throw ApiError.BadRequest('no req parameters');
      }
      const parametrs = { ...req.query };
      const dataList = await issueServices.getIssue(id, parametrs);
      await res.status(200).json({
        result: dataList,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new issueController();
