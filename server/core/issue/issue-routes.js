import { Router } from 'express';
import issueController from './issue-controller.js';

const issueRouter = Router();

issueRouter.get('/:id', issueController.getIssue);

export default issueRouter;
