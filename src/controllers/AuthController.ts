import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/TokenService';
import { CredentialService } from '../services/CredentialService';
import { AuthRequest } from '../types';
import { Roles } from '../constants';
import refreshTokenModel from '../models/refreshTokenModel';
import { Config } from '../config';

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
  ) {
    this.userService = userService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    let DOMAIN = Config.DOMAIN;

    const { firstName, lastName, email, password } = req.body;

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.CUSTOMER,
      });

      const payload: JwtPayload = {
        sub: String(user._id),
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

      const newRefreshToken = await refreshTokenModel.create({
        user: user,
        expiresAt: new Date(Date.now() + MS_IN_YEAR),
      });

      const refreshToken = this.tokenService.generaterefreshToken({
        ...payload,
        id: newRefreshToken._id?.toString(),
      });

      res.cookie('accessToken', accessToken, {
        // domain: "https://gfms-admin-dashboard.vercel.app",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie('refreshToken', refreshToken, {
        // domain: "https://gfms-admin-dashboard.vercel.app",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      res.status(201).json({ id: user._id });
    } catch (error) {
      next(error);
      return;
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    let DOMAIN = Config.DOMAIN;

    const { email, password } = req.body;

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const user = await this.userService.findByEmailWithPassword(email);

      if (!user) {
        const err = createHttpError(400, 'Email or password does not match');
        next(err);
        return;
      }

      let userId = user._id.toString();
      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        const err = createHttpError(400, 'Email or password does not match');
        next(err);
        return;
      }

      const payload: JwtPayload = {
        sub: userId,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

      const newRefreshToken = await refreshTokenModel.create({
        user: user,
        expiresAt: new Date(Date.now() + MS_IN_YEAR),
      });

      const refreshToken = this.tokenService.generaterefreshToken({
        ...payload,
        id: newRefreshToken._id?.toString(),
      });

      res.cookie('accessToken', accessToken, {
        // domain: "https://gfms-admin-dashboard.vercel.app",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie('refreshToken', refreshToken, {
        // domain: "https://gfms-admin-dashboard.vercel.app",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
      });

      this.logger.info('User has been logged in', {
        id: userId,
      });

      res.json({ id: userId });
    } catch (error) {
      next(error);
      return;
    }
  }

  async self(req: AuthRequest, res: Response) {
    const user = await this.userService.findById(req.auth.sub);
    res.json(user);
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const DOMAIN = Config.DOMAIN;
      const payload: JwtPayload = {
        sub: req.auth.sub,
        role: req.auth.role,
        tenant: req.auth.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const user = await this.userService.findById(req.auth.sub);
      if (!user) {
        const error = createHttpError(
          400,
          'User with the token could not find',
        );
        next(error);
        return;
      }

      // Persist the refresh token
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      // Delete old refresh token
      await this.tokenService.deleteRefreshToken(req.auth.id as string);

      const refreshToken = this.tokenService.generaterefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      res.cookie('accessToken', accessToken, {
        // domain: "https://gfms-admin-dashboard.vercel.app",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // 1h
        httpOnly: true, // Very important
      });

      res.cookie('refreshToken', refreshToken, {
        // domain: "https://gfms-admin-dashboard.vercel.app",
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
        httpOnly: true, // Very important
      });

      this.logger.info('User has been logged in', { id: user.id });
      res.json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.tokenService.deleteRefreshToken(req.auth.id as string);
      this.logger.info('Uer h sbeen oggedd out', { id: req.auth.sub });
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json('User logged out');
    } catch (err) {
      next(err);
      return;
    }
  }
}
