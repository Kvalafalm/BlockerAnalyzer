import externalConnectionsService from '../externalConnections/externalConnections-service.js';
import { getArrayOfStatus } from '../ImportData/ImportData-library.js';
import moment from 'moment';
import BlockerServices from '../bloker/Blocker-services.js';
import { getColorByStatus } from '../../../library/library';
const formatExportDate = 'YYYY-MM-DD HH';

class issueServices {
  async getIssue(id, parametrs) {
    const [issue] = await externalConnectionsService.getIssuesByID([id]);
    if (!issue) {
      return 'empty';
    }
    const firstRow = {
      start: moment(issue.fields.created),
      value: issue.fields.status.name,
    };
    const statusLog = await getArrayOfStatus(
      issue.changelog.histories,
      firstRow
    );
    const projectId = issue.fields.project.key;
    const projectStatuses = await externalConnectionsService.getProjectStatuses(
      projectId
    );

    const timelinedata = [];
    let switchColor = true;
    for (const logRow of statusLog) {
      const end = logRow.end ? logRow.end : moment();
      const row = {
        category: 'Work',
        start: logRow.start.format(formatExportDate),
        end: end.format(formatExportDate),
        task: logRow.value,
        description: logRow.value,
      };
      row.typeOfStatus = getTypeStatus(projectStatuses, logRow.valueId);
      logRow.typeOfStatus = row.typeOfStatus;
      row.color = getColorByStatus(row.typeOfStatus);
      timelinedata.push(row);
    }

    let subtaskStatusLog;
    if (parametrs.subtasks === 'true') {
      subtaskStatusLog = await this.getSubTaskStatusLog(issue.fields.subtasks);
      switchColor = true;
      if (subtaskStatusLog) {
        for (const logRow of subtaskStatusLog) {
          if (!logRow.end) {
            continue;
          }
          const end = logRow.end ? logRow.end : moment();
          const row = {
            category: 'subtask ' + logRow.issuetype,
            start: logRow.start.format(formatExportDate),
            end: end.format(formatExportDate),
            task: logRow.value,
            description: logRow.value,
          };

          row.typeOfStatus = getTypeStatus(projectStatuses, logRow.valueId);
          logRow.typeOfStatus = row.typeOfStatus;
          row.color = getColorByStatus(row.typeOfStatus);
          timelinedata.push(row);
        }
      }
    }

    let blockers;
    if (parametrs.blockers === 'true') {
      const blockers = await BlockerServices.getBlockersListById(id);
      for (const iterator of blockers) {
        const end = iterator.end ? moment(iterator.end) : moment();
        const row = {
          category: 'blockers',
          start: moment(iterator.start).format(formatExportDate),
          end: end.format(formatExportDate),
          description: `${iterator.tags[0]} ${iterator.reason}`,
          typeOfWork: 'blockers',
          color: 'red',
        };

        timelinedata.push(row);
      }
    }

    let worklogs;
    if (parametrs.worklogs === 'true') {
      const to = statusLog[statusLog.length - 1].end ?? moment();
      const notWorkTime = getRestTime(statusLog[0].start, to);
      for (const iterator of notWorkTime) {
        timelinedata.push(iterator);
      }

      const arrayOfIssue = [].concat(issue).concat(issue.fields.subtasks);

      worklogs = await this.getWorklogs(arrayOfIssue);
      for (const worklog of worklogs) {
        const row = {
          category: 'worklog',
          ...worklog,
          color: 'yellow',
        };

        timelinedata.push(row);
      }
    }

    return {
      id: issue.key,
      statusLog,
      subtaskStatusLog,
      blockers,
      worklogs,
      timelinedata,
    };
  }

  async getWorklogs(issues) {
    const worklogs = [];
    for (const issue of issues) {
      const worklogRows =
        await externalConnectionsService.getIssuesWorklogByIdIssue(issue.key);
      for (const worklog of worklogRows) {
        const description = `${issue.fields.summary} ${
          worklog.comment ? worklog.comment : ' - ' + worklog.comment
        }`;
        const end = moment(worklog.started)
          .add(worklog.timeSpentSeconds, 's')
          .format(formatExportDate);
        const start = moment(worklog.started).format(formatExportDate);

        const row = {
          start,
          end,
          task: `${worklog.author.displayName} - ${issue.fields.summary}`,
          description,
          author: worklog.author.displayName,
          timeInSecond: worklog.timeSpentSeconds,
          typeOfWork: 'work',
        };

        worklogs.push(row);
      }
      issueServices;
    }

    return worklogs;
  }

  async getSubTaskStatusLog(subtasks) {
    const keysOfSubTask = [];
    for (const iterator of subtasks) {
      keysOfSubTask.push(iterator.key);
    }

    const subTasksWithChangeLog =
      await externalConnectionsService.getIssuesByID(keysOfSubTask);
    if (!subTasksWithChangeLog) {
      return null;
    }

    let subtasksStatusLog = [];
    for (const subtask of subTasksWithChangeLog) {
      const firstRow = {
        start: moment(subtask.fields.created),
        value: subtask.fields.status.name,
        valueId: subtask.fields.status.id,
      };
      const subtaskStatusLog = await getArrayOfStatus(
        subtask.changelog.histories,
        firstRow
      );
      for (const iRow of subtaskStatusLog) {
        subtasksStatusLog.push({
          ...iRow,
          issuetype: `${subtask.fields.issuetype.name}${
            subtask.fields.priority.id - 1
          }`,
        });
      }
    }

    return await subtasksStatusLog;
  }
}

const getRestTime = (from, to) => {
  const workHours = {
    from: '08',
    to: '18',
  };
  const Holydays = [
    '2022-05-02',
    '2022-05-03',
    '2022-05-09',
    '2022-05-09',
    '2022-06-13',
    '2022-02-23',
    '2022-03-08',
  ];

  let HolydaysFiltred = Holydays.filter(element => {
    return moment(element).isBetween(from, to, 'day', '()');
  });
  const tempArrayOfRestTime = [];
  for (const iterator of HolydaysFiltred) {
    const date = moment(iterator);
    tempArrayOfRestTime.push({
      start: date.format('YYYY-MM-DD 00'),
      end: date.format('YYYY-MM-DD 24'),
    });
  }
  const countOfDay = to.diff(from, 'day');
  const startDate = from;
  for (let index = 0; index < countOfDay; index++) {
    startDate.add(1, 'day');

    if (startDate.day() === 6 || startDate.day() === 0) {
      tempArrayOfRestTime.push({
        start: startDate.format('YYYY-MM-DD 00'),
        end: startDate.format('YYYY-MM-DD 24'),
      });
    } else {
      tempArrayOfRestTime.push({
        start: startDate.format('YYYY-MM-DD 00'),
        end: startDate.format('YYYY-MM-DD ' + workHours.from),
      });
      tempArrayOfRestTime.push({
        start: startDate.format('YYYY-MM-DD ' + workHours.to),
        end: startDate.format('YYYY-MM-DD 24'),
      });
    }
  }

  let arrayOfRestTime = [];
  for (const row of tempArrayOfRestTime) {
    arrayOfRestTime.push({
      category: 'worklog',
      start: row.start,
      end: row.end,
      description: 'Выходные',
      color: 'grey',
    });
  }

  return arrayOfRestTime;
};

const getTypeStatus = (projectStatuses, statusId) => {
  const [status] = projectStatuses.filter(e => {
    return e.id === statusId;
  });
  if (!status) {
    console.log("Неизвестный статус ",statusId);
    return 0;
  }
  return status.typeOfStatus;
};

export default new issueServices();
