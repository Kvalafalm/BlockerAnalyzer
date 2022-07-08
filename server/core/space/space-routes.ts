import { Router } from 'express';
import spaceController from './space-controller';

const routerSpace = Router();

routerSpace.get('/list', spaceController.getSpaceList);

export default routerSpace;
