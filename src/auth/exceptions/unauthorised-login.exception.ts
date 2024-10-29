import { UnauthorizedLoginError } from 'auth/enums';
import { BaseException } from 'shared/exceptions';

export class UnauthorizedLoginException extends BaseException {
  static defaultMessage = 'Unauthorized login atempt';
  constructor(public code: UnauthorizedLoginError, message?: string) {
    super(message || UnauthorizedLoginException.defaultMessage);
    this.name = 'UnauthorizedLoginException';
  }
}
