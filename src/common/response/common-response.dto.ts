import { flattenObjectWithoutProps } from '../util/util';

interface ResponseOptions {
  totalCount?: number;
}

export class CommonResponseDto {
  createResponseData(data: any): any {
    return flattenObjectWithoutProps(data);
  }

  public toResponse(responseBody: any, options?: ResponseOptions | any) {
    return {
      data: this.createResponseData(responseBody),
      totalCount: options?.totalCount,
      message: 'success',
    };
  }
}
