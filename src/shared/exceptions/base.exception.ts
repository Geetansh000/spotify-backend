export class BaseException extends Error {
    public name: string;
    public code?: string;
    constructor(message?: string, public errors?: any, public statusCode?: number) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  