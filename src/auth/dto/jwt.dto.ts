import { Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { JSONDto } from 'src/shared/types/json-dto.type';
export class UserJWTDto extends JSONDto {
  uuid: string;

  sub: string;

  email: string;

  // @Expose({ name: 'phone_number' })
  // phoneNumber: string;

  @Expose({ name: 'jwt_id' })
  jwtId: string;

  ip?: string;

  constructor(data: Partial<UserJWTDto>) {
    super();
    Object.assign(this, data);
  }
}
export class TokenDto extends JSONDto {
  @Expose({ name: 'access_token' })
  @IsString()
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  @IsString()
  refreshToken: string;

  @Expose({ name: 'refresh_token_expires_at' })
  @IsString()
  refreshTokenExpiresAt: string;

  @Expose({ name: 'token_validity' })
  @IsString()
  tokenValidity: number;

  constructor(data: Partial<TokenDto>) {
    super();
    Object.assign(this, data);
  }
}
