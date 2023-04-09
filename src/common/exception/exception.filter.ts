import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from './base.exception';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;
    if (exception instanceof BaseException) {
      exception = this.mapBaseExceptionToHttpException(exception);
    }
    if (!(exception instanceof HttpException)) {
      throw new InternalServerErrorException(exception);
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    };
    this.logger.debug(log);

    res.status((exception as HttpException).getStatus()).json(response);
  }

  private mapBaseExceptionToHttpException(exception: BaseException) {
    const statusCode = exception.getResponseBody().statusCode;
    if (statusCode.startsWith('45')) {
      return new InternalServerErrorException(exception.getResponseBody());
    } else if (statusCode.startsWith('41')) {
      return new UnauthorizedException(exception.getResponseBody());
    } else if (statusCode.startsWith('44')) {
      return new NotFoundException(exception.getResponseBody());
    } else if (statusCode.startsWith('40')) {
      return new BadRequestException(exception.getResponseBody());
    } else if (statusCode.startsWith('49')) {
      return new ConflictException(exception.getResponseBody());
    } else if (statusCode.startsWith('43')) {
      return new ForbiddenException(exception.getResponseBody());
    } else {
      return new InternalServerErrorException(exception.getResponseBody());
    }
  }
}
