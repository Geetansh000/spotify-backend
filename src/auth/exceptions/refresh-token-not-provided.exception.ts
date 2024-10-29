import { ValidationErrors } from 'auth/enums';
import { BaseException } from 'shared/exceptions';


export class RefreshTokenNotProvidedException extends BaseException {
  static defaultMessage = ValidationErrors.REFRESH_TOKEN_NOT_PROVIDED_IN_COOKIES;
  constructor(message?: string) {
    super(message || RefreshTokenNotProvidedException.defaultMessage);
    this.name = 'RefreshTokenNotProvidedException';
  }
}
