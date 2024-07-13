import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppError } from './app-error';
import { MongoError } from 'mongodb';

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
      message = this.extractHttpExceptionMessage(exception as HttpException);
    } else if (exception instanceof MongoError) {
      statusCode = this.handleMongoError(exception);
      message = this.handleMongoErrorMessage(exception);
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }
    response.status(statusCode).json({
      status: statusCode < 500 ? 'fail' : 'error',
      message: message.toString(),
    });
  }

  private extractHttpExceptionMessage(exception: HttpException): string {
    const errorResponse = exception.getResponse();
    if (typeof errorResponse === 'object' && 'message' in errorResponse) {
      return errorResponse['message'].toString();
    }
    return errorResponse.toString();
  }

  private handleMongoError(err: MongoError): number {
    switch (err.code) {
      case 11000:
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private handleMongoErrorMessage(err: MongoError): string {
    if (err.code === 11000) {
      const errorMessage = err.message || 'Duplicate key error';
      if (errorMessage.includes('email')) {
        return `Duplicate email found. Please use another email.`;
      }
    }
    return 'Database error';
  }

  // private handleTokenError = () => {
  //   return new AppError('Invalid token, please try again', 401);
  // };
  
  // private handleExpiredTokenError = () => {
  //   return new AppError('Token has expired, please try again', 401);
  // };

  // private handleDuplicateFieldsDb = (err) => {
  //   const value = err.keyValue
  //     ? Object.values(err.keyValue).join(', ')
  //     : 'Unknown value';
  //   const message = `Duplicate field value: ${value}. Please use another value!`;
  //   return new AppError(message, 400);
  // };

  // private handleCastErrorDb = (err) => {
  //   const message = `Invalid ${err.path}, please pass in a valid id`;
  //   return new AppError(message, 400);
  // };
}
