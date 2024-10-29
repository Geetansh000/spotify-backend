import { BaseException } from './base.exception';

export class ResourceDoesnotExistException extends BaseException {
  static defaultMessage = 'Resource does not exist';
  constructor(public code?: string, message?: string) {
    super(message || code || ResourceDoesnotExistException.defaultMessage);
    this.name = 'ResourceDoesnotExistException';
  }
}
