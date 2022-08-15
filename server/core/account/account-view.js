class accountView {
  static formDBtoFrontend(accountModel) {
    const params = {
      externalServiceType: accountModel.externalServiceType,
      externalServiceURL: accountModel.externalServiceURL,
      name: accountModel.name,
      login: accountModel.login,
      id: accountModel._id.toString()
    };

    return params;
  }
}

export default accountView;
