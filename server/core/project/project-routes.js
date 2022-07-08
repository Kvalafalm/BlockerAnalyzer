import { Router } from 'express';
import projectController from './project-controller.js';

const routerProject = Router();

routerProject.get('/list', projectController.getProjectList);

export default routerProject;
