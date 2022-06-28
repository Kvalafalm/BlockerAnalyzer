import fetch from 'node-fetch';
import config from 'config';
import ApiError from '../../utils/exceptions/api_error';

const authToken = btoa(
  `${config.get('jiraUser')}:${config.get('jiraPassword')}`
);

class jiraConnections {
  async getIssuesByID(issuesList, fields = '', expand = '', params) {
    const requestUrl = `https://${config.get('jira')}/rest/api/latest/search`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    };

    const body = {
      jql: `key in (${issuesList.join(',')})`,
      maxResults: params.maxResults,
      fields,
      expand,
      startAt: params.startAt,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    };
    try {
      const response = await fetch(requestUrl, options);
      const data = await response.json();
      const { startAt, maxResults, total } = data;
      return data;
    } catch (error) {
      throw ApiError.BadRequest('Error request to Jira', error);
    }
  }

  async getIssuesKeyFromKanbanBoard(idboard, fields, jql) {
    //https://jira.lcgs.ru/rest/agile/1.0/board/229/issue?expand=changelog
    const maxResults = 1000;
    const startAt = 0;
    const requestUrl = `https://${config.get(
      'jira'
    )}/rest/agile/1.0/board/${idboard}/issue?jql=${jql}&fields=${fields}&maxResults=${maxResults}`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    };

    const options = {
      method: 'GET',
      headers: headers,
    };
    try {
      const response = await fetch(`${requestUrl}&startAt=${startAt}`, options);
      const data = await response.json();
      const ArrayKeys = [];
      for (const row of data.issues) {
        ArrayKeys.push(row.key);
      }
      for (let index = 1; index < data.total / maxResults; index++) {
        const response = await fetch(
          `${requestUrl}&startAt=${index * maxResults}`,
          options
        );
        const data = await response.json();
        for (const row of data.issues) {
          ArrayKeys.push(row.key);
        }
      }

      return ArrayKeys;
    } catch (error) {
      throw ApiError.BadRequest('Error request to Jira', error);
    }
  }

  async getCommentsByIdIssue(id) {
    const requestUrl = `
    https://${config.get('jira')}/rest/api/2/issue/${id}/comment`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    };

    const options = {
      method: 'GET',
      headers: headers,
    };

    try {
      const response = await fetch(requestUrl, options);
      const data = await response.json();
      return await data;
    } catch (error) {
      throw ApiError.BadRequest('Error request to Jira', error);
    }
  }

  async getWorklogByIdIssue(id) {
    const requestUrl = `https://${config.get(
      'jira'
    )}/rest/api/2/issue/${id}/worklog`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    };

    const options = {
      method: 'GET',
      headers: headers,
    };

    try {
      const response = await fetch(requestUrl, options);
      const data = await response.json();
      return data;
    } catch (error) {
      throw ApiError.BadRequest('Error request to Jira', error);
    }
  }

  async getProjectStatuses(id) {
    const requestUrl = `https://${config.get(
      'jira'
    )}/rest/api/2/project/${id}/statuses`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authToken}`,
    };

    const options = {
      method: 'GET',
      headers: headers,
    };

    try {
      const response = await fetch(requestUrl, options);
      if (response.status === 404) {
        throw ApiError.BadRequest('Error request to Jira', error);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw ApiError.BadRequest('Error request to Jira', error);
    }
  }
}

export default new jiraConnections();
