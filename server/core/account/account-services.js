import externalConnectionsService from '../externalConnections/externalConnections-service.js';
import accountModel from './account-model.js';
import accountView from './account-view.js';

class accountServices {
  async getSettingForExternalConnection(id = '') {
    let _id = id.length === 12 ? id : undefined;
    if (_id === undefined) {
      _id = await this.getIDDefaultAccount();
      if (!_id) {
        return false;
      }
    }
    const params = await accountModel.findById(_id);

    return params;
  }

  async getAccountSetting(id) {
    let _id = id.length === 12 ? id : undefined;
    if (_id === undefined) {
      _id = await this.getIDDefaultAccount();
      if (!_id) {
        return false;
      }
    }
    const params = await accountModel.findById(_id);
    const paramsForFront = await accountView.formDBtoFrontend(params);

    return paramsForFront;
  }

  async setAccountSetting(id, params) {
    let _id = id.length === 12 ? id : undefined;
    if (_id === undefined) {
      _id = await this.getIDDefaultAccount();
    }

    if (_id === undefined) {
      const newAccount = new accountModel({ ...params });
      await newAccount.save();
      return newAccount;
    }

    const paramsForFront = await accountModel.findByIdAndUpdate(_id, {
      ...params,
    });

    await externalConnectionsService.reloadConnection('')

    return paramsForFront;
  }

  async getIDDefaultAccount() {
    const document = await accountModel.findOne({});
    const _id = document?._id;
    return _id?.toString();
  }
}

export default new accountServices();
