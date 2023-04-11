import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from '../auth/auth';

export const GetUserIdFromAccessToken = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();

    const { id } = Auth.validateAccessTokenOrThrowError(req);
    return id;
  },
);
