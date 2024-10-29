import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { RefreshTokenException } from '../refresh-token.exception';

@Catch(RefreshTokenException)
export class RefreshTokenExceptionFilter implements ExceptionFilter {
  catch(exception: RefreshTokenException, host: ArgumentsHost) {
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
      code: exception.code || exception.message,
    });
  }
}
