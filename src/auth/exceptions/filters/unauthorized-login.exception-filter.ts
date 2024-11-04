import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UnauthorizedLoginException } from '../';

@Catch(UnauthorizedLoginException)
export class UnauthorizedLoginExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedLoginException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errors: any = exception.errors;

    response.status(exception.statusCode || HttpStatus.BAD_REQUEST).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
      errors,
      status: exception.statusCode || HttpStatus.BAD_REQUEST,
      message: exception.message,
      code: exception.code,
    });
  }
}
