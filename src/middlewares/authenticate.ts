import { GetVerificationKey, expressjwt } from 'express-jwt';
import jwksClient from 'jwks-rsa';
import { Config } from '../config';
import { Request } from 'express';
import { AuthCookie } from '../types';

console.log('hello', Config.JWKS_URI!);
let privateKey = "const err = createHttpError(500, 'Error while reading private key');";

export default expressjwt({
  // secret: jwksClient.expressJwtSecret({
  //   jwksUri: Config.JWKS_URI!,
  //   cache: true,
  //   rateLimit: true,
  // }) as GetVerificationKey,
  secret: "const err = createHttpError(500, 'Error while reading private key');",
  // algorithms: ['RS256'],
  algorithms: ['HS256'],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
      const token = authHeader.split(' ')[1];
      if (token) {
        console.log('TOKEN +', token);
        return token;
      }
    }
    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});
