export class TopicCommonResponseDto {
  constructor(responseBody: any, options?: any) {
    return {
      data: responseBody,
      pageTotalCount: options?.pageTotalCount,
      message: 'success',
    };
  }
}
