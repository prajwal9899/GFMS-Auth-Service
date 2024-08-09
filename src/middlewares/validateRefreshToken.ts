import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { Request } from 'express';
import { AuthCookie, IRefreshTokenPayload } from '../types';
import logger from '../config/logger';
import refreshTokenModel from '../models/refreshTokenModel';

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SECRET!,
  algorithms: ['HS256'],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },
  async isRevoked(req: Request, token) {
    try {
      const refreshToken = await refreshTokenModel.findOne({
        where: {
          id: Number((token?.payload as IRefreshTokenPayload).id),
          user: {
            id: Number(token?.payload.sub),
          },
        },
      });

      return refreshToken === null;
    } catch (err) {
      logger.error('Error while getting refresh token', {
        id: (token?.payload as IRefreshTokenPayload).id,
      });
    }
    return true;
  },
});
