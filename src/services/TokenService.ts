import fs from 'fs';
import path from 'path';
import { JwtPayload, sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Config } from '../config';
import refreshTokenModel from '../models/refreshTokenModel';

export class TokenService {
  generateAccessToken(payload: JwtPayload) {
    // let privateKey: Buffer;
    // try {
    //   privateKey = fs.readFileSync(
    //     path.join(__dirname, '../../certs/private.pem'),
    //   );
    // } catch (error) {
    //   const err = createHttpError(500, 'Error while reading private key');
    //   throw err;
    // }
    let privateKey =
      'MIIEpAIBAAKCAQEA6xH/Dmid2dj4lYJ/K42fGwVdkUmszg2BJH0JyTzxrxFLecVBEoYLgTl2RTTH2bvp7guWp3un3MKizaJoSZNBXmlASkF3tEBx82owr6pPQiYuerwJeMH7lSOdSu7J/ptGqBgDLcAHVktehyltF8qwWl4b9Pt797TY7WU1WF66JOsHhmmMCQinigcuQJkuKQ1j8KVJ/VGvH9SUZSdwX1ccj4KOJZcS3/b5yvYpLW6p05xVDFl0SZ1NUx/Kkm0NyZHDdTNQQDetApT6FV/tx69Gmtf9KIqmCMy5kNUUi48ezlTPdhqGGbim3wE1gpK5ZsDWbXqm9bHq/cD1bjJEktUaJQIDAQABAoIBAAWHJPrXQ02yAwKCZkWFbTuVmuIwRoPf9cIAaMBWkmO+DIrUCdg1gRlsWwInSsMtiUOY+oAnccaeEyBdKduqaVae3gKrsHTI29p6tvi35hOVp0Z+m9sUS2YcnMsm0Lw6iuT9ZOcTWs4mM+u0xy/Qiz4iHsEvlXY5Rq1VJyB+tceUGHeICSTo3MacSVQJHaeafjhvtN3dOTAeT9jfFPZof/q8vJAKcV1CUcr1j6/eLiAzxB2X1ZxbNHLfjc8GQhcwk5EiamPpTjIC/oXPNcOuOuZNiWeyA2VmDX7rx0FuvxKM6+WZW/AIeWiWuDR7WodjhaW4f8B84FxZFMUy8/FXdvECgYEA+0+sRl3cEx6qqWZedGKwb0xx9ogN58unPDbxfyGittke1nZ+K60/TGBXRsAkTLFwWGHXNK5shr/7ScWhKvAL319WUjbC/GMHwcNjF1fPTpIwyVYm3jqH77Gc+t8WLhFFEEe2RJXUuDpd4vUFClPS1YVuR7r5tTq6pu89ZzhK7qkCgYEA73TApe/xFRMQj/vK4DFBtypfWYJfUPKk5HvLfqfoxIVL4vbh9wANPfeWY4EplhKac4onWoL/QKawAOlbG4BLmY0McJHFLd8Ocj3SftxmTyblNY4a9GSFlpOfR4MceQlALQ7mOrHquYF8IKjQJyhLNjblyLzfGrtksQ/naf+HKR0CgYEAwQs0hGD4+l7mLXYLPE/Kw9Pu/rcIJ3QSpHh4DXYi7V3fCFLBHH/aTar7n8dcmuT6LYoKq9cIWoICX2rGIJuAIzeysTiLkx/nB3o1FetHvU0i2KWq+a3wWbkPos3W1dBCQv0zD4AghNug3wPjuUkmfQof6k3AHuxcEHtZqX5eYPECgYEA34LWU82M9cPu4McBzpSLp6IIkG9N8ywaWB9pihbHAbD+baNOtpS4x4+0M7sbizZgLtrU8vp1se4lOSSY4ym052YuJ2EZcUDUpjQoqDunz9gZeQzlAhxWSYAP29t5F01YNvbCViU+WNuRdpa8fOBym+9QOzh48+XZDiEvO9TFX80CgYBPsTrKlVoaQyWOaNq1NRIMdY13+VDJRDWQ9bFuaxFlHjgwllfFRwmx9Jo7EmBCafaDBQoSLw2auXOqHoupmhTHSlLUVnGlz2GU7s0acF2FB8qO3UzC3FNcoO4lzTszOudl7hPNMaKPUx3bA9CXHLz+4tsvxBvkTC1bg3xPlqzdNQ==';
    const accessToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'Auth Service',
    });
    return accessToken;
  }

  generaterefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      algorithm: 'HS256',
      expiresIn: '1y',
      issuer: 'Auth Service',
      jwtid: String(payload.id),
    });

    return refreshToken;
  }

  async persistRefreshToken(user: any) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // 1Y -> (Leap year)

    const newRefreshToken = await refreshTokenModel.create({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }

  async deleteRefreshToken(tokenId: string) {
    return await refreshTokenModel.findByIdAndDelete({ _id: tokenId });
  }
}
