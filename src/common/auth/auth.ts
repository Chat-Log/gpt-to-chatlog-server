import * as jwt from 'jsonwebtoken';
import Config from '../../config/config';
import { Request } from 'express';
import {
  TokenExpiredException,
  TokenInvalidException,
} from '../exception/auth.exception';
import { UserRole } from '../enum/enum';
import { UserNotFoundException } from '../exception/data-access.exception';

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
    if (!accessToken) {
      throw new TokenInvalidException('no access token in request');
    }
    try {
      return jwt.verify(accessToken, Config.accessTokenSecret);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredException('token expired');
      }
      throw new TokenInvalidException('invalid token');
    }
  }
  static checkSameUserWithToken(request: Request, userId: string) {
    const payload = Auth.validateAccessTokenOrThrowError(request);
    if (payload['id'] !== userId) {
      throw new UserNotFoundException(
        'not same user id in token and request body',
      );
    }
  }
}
