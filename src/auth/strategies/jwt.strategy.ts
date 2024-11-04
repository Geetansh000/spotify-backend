import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserJWTDto } from 'src/auth/dto/jwt.dto';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { set } from 'lodash';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

const EXCLUDED_URLS_FROM_MFA = [
  '/v1/auth/login/mfa-otp/verify',
  '/v1/auth/login/mfa-otp/resend',
  '/v1/auth/logout',
  '/v1/auth/logout/all-devices',
  '/v1/users/:userUUID/identity-verification',
  '/v1/users/:userUUID/phone',
  '/v1/users/:userUUID/phone/verify',
  '/v1/users/:userUUID/phone/resend-otp',
  '/v1/users/:userUUID/identity/verify',
  '/v1/users/:userUUID/identity/resend-otp',
  '/v1/users/:userUUID/document/resend-otp',
];

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: UserJWTDto): Promise<User> {
    const { sub } = plainToClass(UserJWTDto, payload);
    return await this.userService.getByUUID(sub);
  }
}
