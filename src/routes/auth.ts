import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import logger from '../config/logger';
import { NextFunction, Request, Response } from 'express';
import RegisterValidator from '../validators/RegisterValidator';
import { TokenService } from '../services/TokenService';
import LoginValidator from '../validators/LoginValidator';
import { CredentialService } from '../services/CredentialService';
import authenticate from '../middlewares/authenticate';
import { AuthRequest } from '../types';
import validateRefreshToken from '../middlewares/validateRefreshToken';
import parseRefreshToken from '../middlewares/parseRefreshToken';

const router = express.Router();
const userService = new UserService();
const tokenService = new TokenService();
const credentialService = new CredentialService();
const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

router.post(
  '/register',
  RegisterValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

router.post(
  '/login',
  LoginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

router.get('/self', 
  authenticate, 
  (req: Request, res: Response) =>
  authController.self(req as AuthRequest, res),
);

router.post(
  '/refresh',
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
);

router.post(
  '/logout',
  authenticate,
  parseRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as AuthRequest, res, next),
);

export default router;
