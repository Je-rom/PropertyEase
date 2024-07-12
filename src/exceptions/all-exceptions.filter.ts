import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from './app-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let message: string;

    if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.getResponse() as string;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    response.status(statusCode).json({
      status: statusCode < 500 ? 'fail' : 'error',
      message,
    });
  }
}
