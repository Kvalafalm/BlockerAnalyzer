import { Router } from 'express';
import BlockerController from './Blocker-controller.js';

const blockerRouter = Router();

blockerRouter.get('/list', BlockerController.getList);
blockerRouter.post('/', BlockerController.setBlocker);

export default blockerRouter;
