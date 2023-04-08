import { User } from '../../domain/user';

interface UserCommonResponseBody {
  user?: User;
  data?: any;
}

export class UserCommonResponseDto {
  constructor(responseBody: UserCommonResponseBody, options?: any) {
    const { user, data } = responseBody;

    const userProps = user.getPropsCopy();
    const { password, gptKey, ...userPropsWithoutAuth } = userProps;

    return {
      data: {
        ...userPropsWithoutAuth,
        ...data,
        gptKey: gptKey && UserCommonResponseDto.maskingGptKey(gptKey),
      },
      message: 'success',
    };
  }

  private static maskingGptKey(gptKey: string) {
    return gptKey.slice(0, 8) + '*'.repeat(gptKey.length);
  }
}
