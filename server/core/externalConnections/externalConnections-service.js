import ApiError from '../../utils/exceptions/api_error';
import accountServices from '../account/account-services.js';
import jiraConnections from './externalConnections-jiraServer.js';


class externalConnectionsService {
  constructor() {
    accountServices
      .getSettingForExternalConnection()
      .then((connectionData) => {
        this.LoadConnectionData(connectionData)
      });
  }

  async getIssuesByID(keys) {

    if (!this.connetion) {
      return undefined
    }

    const fields = [
      'project',
      'priority',
      'summary',
      'issuetype',
      'created',
      'status',
      'subtasks',
    ];
    const expand = ['changelog'];
    const maxResult = 50;
    let issuesAll = [];
    for (let index = 0; index < keys.length / maxResult; index++) {
      const params = {
        startAt: index * maxResult - 1,
        maxResult,
      };
      const { issues } = await this.connetion.getIssuesByID(
        keys,
        fields,
        expand,
        params
      );
      issuesAll = await issuesAll.concat(issues);
    }

    return issuesAll;
  }

  async getIssuesKeyFromKanbanBoard(params) {

    if (!this.connetion) {
      return undefined
    }

    let jql = '';
    const fields = ['key'];

    if (params.choiceByUpdateDate) {
      jql = `updatedDate%20%20%3E%3D%20%22${params.StartDate.format(
        'YYYY-MM-DD'
      )}%22%20AND%20updatedDate%20%20%3C%3D%20%20%22${params.EndDate.format(
        'YYYY-MM-DD'
      )}%22%20`;
    } else {
      jql = `createdDate%20%20%3E%3D%20%22${params.StartDate.format(
        'YYYY-MM-DD'
      )}%22%20AND%20createdDate%20%20%3C%3D%20%20%22${params.EndDate.format(
        'YYYY-MM-DD'
      )}%22%20`;
    }

    const issues = await this.connetion.getIssuesKeyFromKanbanBoard(
      params.idboard,
      fields,
      jql
    );

    return issues;
  }

  async getCommentsByIdIssue(id) {

    if (!this.connetion) {
      return undefined
    }

    const { comments } = await this.connetion.getCommentsByIdIssue(id);
    return comments;
  }

  async getIssuesWorklogByIdIssue(id) {

    if (!this.connetion) {
      return undefined
    }

    const { worklogs } = await this.connetion.getWorklogByIdIssue(id);
    return worklogs;
  }

  async getProjectStatuses(id) {

    if (!this.connetion) {
      return undefined
    }

    const data = await this.connetion.getProjectStatuses(id);
    let statuses = [];
    for (const issueType of data) {
      for (const status of issueType.statuses) {
        statuses.push({
          name: status.name,
          id: status.id,
          typeOfStatus: status.statusCategory.id,
        });
      }
    }

    let tmpArray = [];
    const itemCheck = item => {
      if (tmpArray.indexOf(item.name) === -1) {
        tmpArray.push(item.name);
        return true;
      }
      return false;
    };

    const uniqueStatuses = statuses.filter(item => itemCheck(item));
    return uniqueStatuses;
  }

  async getProjectList() {
    if (!this.connetion) {
      return undefined
    }
    const data = await this.connetion.getProjectList();
    return data;
  }

  LoadConnectionData(param) {

    if (!param) {
      return
    }

    if (param.URL === '' || param.login === '' || param.password === '') {
      return
    }

    this.URL = param.externalServiceURL;
    this.type = param.externalServiceType;
    this.login = param.login;
    this.password = param.password;

    this.connetion = getConnector(param.externalServiceType, param)

  }
  async reloadConnection(id) {
    try {
      const connectionData = await accountServices.getSettingForExternalConnection(id)
      await this.LoadConnectionData(connectionData)

    } catch (error) {
      throw ApiError.ExternalConnectionError();
    }
  }
  async testConnection(param) {
    const connection = getConnector(param.externalServiceType, param)
    if (connection) {
      return await connection.testConnection(param)
    } else {
    }

  }

  async getURL() {
    return this.URL
  }
}

const getConnector = (externalServiceType, param) => {
  let connection
  switch (externalServiceType) {
    case ConnectionTypes.JIRA82:
      connection = new jiraConnections(param)
      break;
    case ConnectionTypes.JIRACLOUD:
      break;
    case ConnectionTypes.KAITEN:
      break;
    default:
      connection = new jiraConnections(param)
      break;
  }
  return connection
}

export const ConnectionTypes = {
  JIRA82: "Connection.jira8.2",
  JIRACLOUD: "Connection.jiraCloud",
  KAITEN: "Connection.kaiten",
}


/* export interface ExternalConnector {
  getIssuesByID: Function;
  getIssuesKeyFromKanbanBoard: Function;
  getCommentsByIdIssue: Function;
  getWorklogByIdIssue: Function;
  getProjectStatuses: Function;
  getProjectList: Function;
  onChange(name: string): any
  
} */

export default new externalConnectionsService();
