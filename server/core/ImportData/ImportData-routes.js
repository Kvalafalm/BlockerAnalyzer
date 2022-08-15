import { Router } from 'express';
import ImportDataController from './ImportData-controller.js';

/* const { Router }  = require('express');
const ImportDataController = require('./ImportData-controller.cjs'); */
const routerImportData = Router();

routerImportData.get('/space/:spaceid/id/:id', ImportDataController.importDataOne);

routerImportData.post('/period', ImportDataController.importDataPerPeriod);

routerImportData.post('/periodAsync', ImportDataController.importDataPerPeriodAsync);

routerImportData.post('/project/:id', ImportDataController.importProject);

routerImportData.get('/project/list', ImportDataController.getProjects);

routerImportData.get(
  '/project/:id/statuses/',
  ImportDataController.importProjectStatuses
);
export default routerImportData;
