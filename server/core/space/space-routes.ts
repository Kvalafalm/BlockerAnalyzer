import { Router } from 'express';
import spaceController from './space-controller';

const routerSpace = Router();

routerSpace.get('/list', spaceController.getSpaceList);

routerSpace.post('/', spaceController.createSpace);

routerSpace.delete('/:id', spaceController.deleteSpace);

export default routerSpace;
