import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'user/entities/user.entity';

export const AuthUser = createParamDecorator(
  <T extends User = User>(data: string, ctx: ExecutionContext): User => {
    const request: any = ctx.switchToHttp().getRequest();
    return !data ? (request.user as T) : (request.user as T)[data];
  },
);
