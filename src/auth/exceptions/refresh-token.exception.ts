import { ValidationErrors } from 'auth/enums';
import { BaseException } from 'shared/exceptions';

export class RefreshTokenException extends BaseException {
  static defaultMessage = ValidationErrors.REFRESH_TOKEN_ERROR;
  constructor(public code: string, message?: string) {
    super(message || RefreshTokenException.defaultMessage);
    this.name = 'RefreshTokenException';
  }
}
