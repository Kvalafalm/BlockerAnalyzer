import BlockerServices from '../bloker/Blocker-services.js';
import externalConnectionsService from '../externalConnections/externalConnections-service.js';
import config from 'config';
import {
  commentsProcess,
  getFlagFromChangelog,
  getStatusFromChangelog,
  inputEndDateByEndStatustTime,
  addBlockersFromChangeLog,
} from './ImportData-library.js';
import moment from 'moment';
import ApiError from '../../utils/exceptions/api_error';
import spaceServices from '../space/space-services';

class importDataServices {
  async ImportIssuesFromKanbanBoard(
    idboard,
    StartDate = moment(),
    EndDate = moment(),
    choiceByUpdateDate = false
  ) {
    if (!idboard) {
      throw ApiError.BadRequest('No req perams');
    }

    const params = {
      idboard,
      StartDate: moment(StartDate),
      EndDate: moment(EndDate),
      choiceByUpdateDate,
    };
    const { _id } = await spaceServices.getProjectByExternalId(idboard);
    if (!_id) {
      return null
    }
    const issues = await externalConnectionsService.getIssuesKeyFromKanbanBoard(
      params
    );

    if (issues.length === 0) {
      return { result: 'empty array' };
    }
    const result = this.importIssuesByID(issues, _id);
    return result;
  }

  async importIssuesByID(keys, currentSpace) {
    const StartDate = moment();
    const issues = await externalConnectionsService.getIssuesByID(keys);
    let blockerList = await [];
    for (const element of issues) {
      const blockerFromIssue = await this.convertJiraIssueToBlockers(element);
      blockerList = await blockerList.concat(blockerFromIssue);
      await BlockerServices.clearBlockerByIdIssue(element.key);
    }

    let errorsCount = 0;
    for (const element of blockerList) {
      try {
        const startInValid = element?.start?.isValid()
          ? !element?.start?.isValid()
          : true;
        if (startInValid) {
          throw new ApiError(404, 404, 'Ошибка');
        }
        element.idSpace = currentSpace;
        if (!element.end?.isValid()) {
          element.end = undefined;
        }

        await BlockerServices.updateBlocker(element.idBloker, element);
      } catch (error) {
        //console.log(error.idIssue, error.idBloker);
        console.log(error);
        errorsCount += 1;
      }
    }
    const time = moment.duration(moment().diff(StartDate)).seconds();
    return {
      totalFromBoard: keys.length,
      keys,
      totalIssues: issues.length,
      updateBlockers: blockerList.length - errorsCount,
      errorsCount,
      time,
    };
  }

  async convertJiraIssueToBlockers(JiraIssue) {
    const comments = await externalConnectionsService.getCommentsByIdIssue(
      JiraIssue.key
    );
    const issue = {
      project: JiraIssue.fields.project.name,
      idIssue: JiraIssue.key,
      priority: JiraIssue.fields.priority.id - 1,
      titleIssue: JiraIssue.fields.summary,
      linkIssue: `${config.get('protocol')}://${config.get('jira')}/browse/${JiraIssue.key
        }`,
      typeIssue: JiraIssue.fields.issuetype.name,
    };

    const BlockerObj = await commentsProcess(comments, issue);

    //getFullChangelog(JiraIssue.key)

    await getFlagFromChangelog(BlockerObj, JiraIssue.changelog.histories);

    await addBlockersFromChangeLog(
      BlockerObj,
      JiraIssue.changelog.histories,
      issue
    );

    await inputEndDateByEndStatustTime(
      BlockerObj,
      JiraIssue.changelog.histories,
      moment(JiraIssue.fields.created)
    );

    const firstRow = {
      start: moment(JiraIssue.fields.created),
      value: JiraIssue.fields.status.name,
    };

    await getStatusFromChangelog(
      BlockerObj,
      JiraIssue.changelog.histories,
      firstRow
    );

    return BlockerObj;
  }

  async importProjectStatuses(projectId) {
    const projectStatuses = await externalConnectionsService.getProjectStatuses(
      projectId
    );
    if (projectStatuses.length === 0) {
      return false;
    }
    const statuses = spaceServices.updateSpace(projectId, {
      statuses: projectStatuses,
    });
    return statuses;
  }


  async getProjects() {
    const projects = await externalConnectionsService.getProjectList();
    if (projects.length === 0) {
      return false;
    }
    return projects;
  }

  async importProject(projectId) {
    const projectStatuses = await externalConnectionsService.getProjectStatuses(
      projectId
    );
    if (projectStatuses.length === 0) {
      return false;
    }
    const statuses = spaceServices.updateOrCreateSpace(projectId, {
      statuses: projectStatuses,
    });
    return statuses;
  }


}

export default new importDataServices();
