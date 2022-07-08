import accountServices from '../account/account-services.js';
import jiraConnections from './externalConnections-jiraServer.js';

class externalConnectionsService {
  constructor() {
    accountServices
      .getSettingForExternalConnection()
      .then(({ externalServiceType, externalServiceURL, login, password }) => {
        this.URL = externalServiceURL;
        this.type = externalServiceType;
        this.login = login;
        this.password = password;
        console.log(this);
      });
  }

  async getIssuesByID(keys) {
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
      const { issues } = await jiraConnections.getIssuesByID(
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

    const issues = await jiraConnections.getIssuesKeyFromKanbanBoard(
      params.idboard,
      fields,
      jql
    );

    return issues;
  }

  async getCommentsByIdIssue(id) {
    const { comments } = await jiraConnections.getCommentsByIdIssue(id);
    return comments;
  }

  async getIssuesWorklogByIdIssue(id) {
    const { worklogs } = await jiraConnections.getWorklogByIdIssue(id);
    return worklogs;
  }

  async getProjectStatuses(id) {
    const data = await jiraConnections.getProjectStatuses(id);
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
    const data = await jiraConnections.getProjectList();
    return data;
  }
}

export default new externalConnectionsService();
