import * as jwt from 'jsonwebtoken';
import Config from '../../config/config';
import { Request } from 'express';
import { TokenInvalidException } from '../exception/auth.exception';
import { UserRole } from '../enum/enum';

interface IssueAccessTokenPayload {
  id: string;
  role?: UserRole;
  status?: string;
}

export class Auth {
  static getAccessTokenFromRequest(request: Request): string | undefined {
    return request.headers['authorization']?.split('Bearer ')[1];
  }

  static issueAccessToken(payload: IssueAccessTokenPayload) {
    return jwt.sign(
      { ...payload, role: payload.role || UserRole.USER },
      Config.accessTokenSecret,
      {
        expiresIn: Config.accessTokenExpired,
      },
    );
  }

  static validateAccessTokenOrThrowError(request: Request) {
    const accessToken = Auth.getAccessTokenFromRequest(request);
    try {
      jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch {
      throw new TokenInvalidException('invalid token');
    }
  }
}
