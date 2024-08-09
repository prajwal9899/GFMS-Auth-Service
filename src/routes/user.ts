import express, { NextFunction, RequestHandler, Response } from 'express';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import logger from '../config/logger';
import createUserValidator from '../validators/create-user-validator';
import { CreateUserRequest, UpdateUserRequest } from '../types';
import updateUserValidator from '../validators/update-user-validator';
import listUsersValidator from '../validators/list-users-validator';
import { Request } from 'express-jwt';

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService, logger);

router.post(
  '/',
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  createUserValidator,
  (req: CreateUserRequest, res: Response, next: NextFunction) =>
    userController.create(req, res, next) as unknown as RequestHandler,
);

router.patch(
  '/:id',
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  updateUserValidator,
  (req: UpdateUserRequest, res: Response, next: NextFunction) =>
    userController.update(req, res, next) as unknown as RequestHandler,
);

router.get(
  '/',
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  listUsersValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
  '/:id',
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req, res, next) =>
    userController.getOne(req, res, next) as unknown as RequestHandler,
);

router.delete(
  '/:id',
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req, res, next) =>
    userController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
