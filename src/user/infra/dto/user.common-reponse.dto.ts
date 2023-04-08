import { User } from '../../domain/user';

interface UserCommonResponseBody {
  user?: User;
  data?: any;
}

export class UserCommonResponseDto {
  constructor(responseBody: UserCommonResponseBody, options?: any) {
    const { user, data } = responseBody;
    console.log(responseBody);
    console.log(data);
    const userProps = user.getPropsCopy();
    const { password, apiKey, ...userPropsWithoutAuth } = userProps;

    return {
      data: {
        ...userPropsWithoutAuth,
        ...data,
      },
      message: 'success',
    };
  }
}
