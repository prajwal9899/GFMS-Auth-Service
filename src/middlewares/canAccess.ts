import { NextFunction, Request, Response } from 'express';
import { Roles } from '../constants';
import { AuthRequest } from '../types';
import createHttpError from 'http-errors';

export const canAccess = (roles:string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest
    const roleFromToken = _req.auth.role;
    if(!roles.includes(roleFromToken)){
      const err = createHttpError(403,"You do not have enough permissions")
      next(err)
      return
    }
    next()
  };
};
