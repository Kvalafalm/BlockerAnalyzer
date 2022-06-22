import { Router } from 'express';

//const auth = require('../middleware/auth.middleware');

// const controller = require('../core/user/auth-controller');
import { check } from 'express-validator';
import authControllerInst from '../core/user/auth-controller';

const routerAuth = Router();
routerAuth.post(
  '/register',
  [
    check('email', 'Email can`t be empty').notEmpty(),
    check('email', 'Email is not correct').isEmail(),
    check(
      'password',
      'Password must be more than 4 and less than 10 characters'
    ).isLength({ min: 4, max: 10 }),
  ],
  authControllerInst.register
);

routerAuth.post('/login', authControllerInst.login);

routerAuth.get('/user', authControllerInst.getUser);

routerAuth.get('/refresh', authControllerInst.refreshToken);

export default routerAuth;
