/* const jiraConnections = require('../externalConnections/jiraConnections'); */
import { param } from 'express-validator';
import ApiError from '../../utils/exceptions/api_error';
import externalConnectionsService from '../externalConnections/externalConnections-service';
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

  async testConnection(req, res, next) {
    try {
      const { params } = req?.body;
      if (!params) {
        throw ApiError.BadRequest('no req parameters');
      }

      const outputParams = await externalConnectionsService.testConnection(params);
      await res.status(200).json({
        result: outputParams,
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
      const parametrs = { ...req.body.params };
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
