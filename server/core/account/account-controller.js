/* const jiraConnections = require('../externalConnections/jiraConnections'); */
import ApiError from '../../utils/exceptions/api_error.js';
import accountServices from './account-services.js';

class accountController {
  async getAccoutnSetting(req, res, next) {
    try {
      const { id } = req?.params;
      if (!id) {
        throw ApiError.BadRequest('no req parameters');
      }

      const params = await accountServices.getAccountSetting(id);
      await res.status(200).json({
        result: params,
      });
    } catch (e) {
      next(e);
    }
  }

  async setAccoutnSetting(req, res, next) {
    try {
      const { id } = req?.params;
      if (!id) {
        throw ApiError.BadRequest('no req parameters');
      }
      const parametrs = { ...req.body };
      const dataList = await accountServices.setAccountSetting(id, parametrs);
      await res.status(200).json({
        result: dataList,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new accountController();
