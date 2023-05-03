import { flattenObjectWithoutProps } from '../util/util';

export class CommonResponseDto {
  createResponseData(data: any): any {
    return flattenObjectWithoutProps(data);
  }
  public toResponse(responseBody: any, options?: any) {
    return {
      data: this.createResponseData(responseBody),
      totalPageCount: options?.totalPageCount,
      message: 'success',
    };
  }
}
