import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? ((exceptionResponse as Record<string, unknown>).message ??
          exception instanceof Error)
          ? (exception as Error).message
          : 'Internal server error'
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const errorName =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? ((exceptionResponse as Record<string, unknown>).error ?? 'Error')
        : 'Internal Server Error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: (Array.isArray(message) ? message[0] : message) as string,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
