import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { RefreshTokenNotProvidedException } from '../refresh-token-not-provided.exception';

@Catch(RefreshTokenNotProvidedException)
export class RefreshTokenNotProvidedExceptionFilter implements ExceptionFilter {
  catch(exception: RefreshTokenNotProvidedException, host: ArgumentsHost) {
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
    });
  }
}
