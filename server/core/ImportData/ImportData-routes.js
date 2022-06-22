import { Router } from 'express';
import ImportDataController from './ImportData-controller.js';

/* const { Router }  = require('express');
const ImportDataController = require('./ImportData-controller.cjs'); */
const routerImportData = Router();

routerImportData.get('/:id', ImportDataController.importDataOne);

routerImportData.post('/period', ImportDataController.importDataPerPeriod);

routerImportData.get(
  '/project/:id/statuses/',
  ImportDataController.importProjectStatuses
);

export default routerImportData;
