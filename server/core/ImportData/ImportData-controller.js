/* const jiraConnections = require('../externalConnections/jiraConnections'); */
import ImportDataServices from './ImportData-services.js';

class ImportDataController {
  async importDataOne(req, res, next) {
    try {
      const { id } = req?.params;
      let result;
      if (id) {
        result = await ImportDataServices.importIssuesByID([id], "spaceId");
      }

      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async importDataPerPeriodAsync(req, res, next) {
    try {
      const { idboard, StartDate, EndDate, choiceByUpdateDate } = req.body;

      ImportDataServices.ImportIssuesFromKanbanBoard(
        idboard,
        StartDate,
        EndDate,
        choiceByUpdateDate
      );

      const result = { message: "Start import" }
      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async importDataPerPeriod(req, res, next) {
    try {
      const { idboard, StartDate, EndDate, choiceByUpdateDate } = req.body;
      const result = await ImportDataServices.ImportIssuesFromKanbanBoard(
        idboard,
        StartDate,
        EndDate,
        choiceByUpdateDate
      );

      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }
  async importProjectStatuses(req, res, next) {
    try {
      const { id } = req?.params;
      const result = await ImportDataServices.importProjectStatuses(id);
      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async importProject(req, res, next) {
    try {
      const { id } = req?.params;
      const result = await ImportDataServices.importProject(id);
      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async getProjects(req, res, next) {
    try {
      const result = await ImportDataServices.getProjects();
      await res.status(200).json({
        result: result,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new ImportDataController();
