import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BaseExceptionFilter } from './exception.filter';

@Module({
  providers: [Logger, { provide: APP_FILTER, useClass: BaseExceptionFilter }],
})
export class ExceptionModule {}
