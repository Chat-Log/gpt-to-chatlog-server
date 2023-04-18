import { CommonResponseDto } from '../../../common/response/common-response.dto';

export class UserCommonResponseDto extends CommonResponseDto {
  override createResponseData(responseBody: any): any {
    const { user, ...data } = responseBody;

    const userProps = user?.getPropsCopy() || {};
    const { password, gptKey, ...userPropsWithoutAuth } = userProps;
    return {
      ...userPropsWithoutAuth,
      ...data,
      gptKey: gptKey && UserCommonResponseDto.maskingGptKey(gptKey),
    };
  }

  private static maskingGptKey(gptKey: string) {
    return gptKey.slice(0, 8) + '*'.repeat(gptKey.length);
  }
}
