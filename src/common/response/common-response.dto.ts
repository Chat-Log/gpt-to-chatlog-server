export class CommonResponseDto {
  //when it is different, should override this method
  createResponseData(data: any): any {
    return data;
  }
  public toResponse(responseBody: any, options?: any) {
    return {
      data: this.createResponseData(responseBody),
      totalPageCount: options?.totalPageCount,
      message: 'success',
    };
  }
}
