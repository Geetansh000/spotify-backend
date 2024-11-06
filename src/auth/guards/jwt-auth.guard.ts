import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export const IS_PUBLIC_KEY = 'isPublic';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, _, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const url = req.url;
    const last = url.substring(url.lastIndexOf('/') + 1, url.length);
    if (last === 'login' || last === 'signup') {
      return user;
    }
    if (!user) {
      throw new UnauthorizedException();
    }

    if (err) {
      throw err;
    }

    delete user.password;
    return user;
  }
}
