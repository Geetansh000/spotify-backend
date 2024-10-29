import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from 'user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'user/user.service';
import { UnauthorizedLoginError, ValidationErrors } from './enums/error.enum';
import { JwtService } from '@nestjs/jwt';
import { TokenDto, UserJWTDto } from './dto/jwt.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ResourceDoesnotExistException } from 'shared/exceptions';
import {
  RefreshTokenException,
  UnauthorizedLoginException,
} from './exceptions';
import { comparePasswords } from 'shared/helpers/password.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    public readonly refreshToken: RefreshTokenRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private parseRefreshToken(token: string) {
    const payload: any = this.jwtService.decode(token);
    let where: any = { token };
    if (payload?.jwt_id) {
      where = { uuid: payload.jwt_id };
    }
    return { where, payload };
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
  async loginUser(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDto);
    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatched) {
      throw new UnauthorizedException(ValidationErrors.PASSWORD_DOES_NOT_MATCH);
    }
    delete user.password;
    const payload = { email: user.email, sub: user.uuid };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async generateJwt(user: User, jwtId: string, ip?: string): Promise<TokenDto> {
    const expiresIn = process.env.JWT_EXPIRATION; // this.common.config.get<number>('jwt.expiresIn');
    const payload = new UserJWTDto({
      uuid: user.uuid,
      sub: user.uuid,
      email: user.email,
      ip,
    });

    return new TokenDto({
      accessToken: this.jwtService.sign(payload.toJSON(), {
        secret: process.env.JWT_SECRET,
      }),
      tokenValidity: Number(expiresIn),
    });
  }

  async generateRefreshToken(user: User): Promise<RefreshToken> {
    return this.refreshToken.save({
      userUUID: user.uuid,
      expiresAt: addMinutes(new Date(), Number(process.env.JWT_EXPIRATION)),
      token: uuidv4(),
    });
  }

  async generateTokens(user: User, ip?: string): Promise<TokenDto> {
    const refreshToken = await this.generateRefreshToken(user);
    return new TokenDto({
      ...(await this.generateJwt(user, refreshToken.uuid, ip)),
      refreshToken: refreshToken.token,
      refreshTokenExpiresAt: refreshToken.expiresAt.toUTCString(),
    });
  }

  async refreshAccessToken(token: string): Promise<TokenDto> {
    const { where, payload } = this.parseRefreshToken(token);
    const refreshToken = await this.refreshToken.findOne({
      where,
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new ResourceDoesnotExistException(
        ValidationErrors.INVALID_REFRESH_TOKEN,
      );
    } else if (refreshToken.isExpired) {
      throw new RefreshTokenException(ValidationErrors.REFRESH_TOKEN_EXPIRED);
    } else if (refreshToken.isRevoked) {
      //Reuse!!
      await this.refreshToken.revokeChain(token);
      throw new RefreshTokenException(ValidationErrors.REFRESH_TOKEN_REUSE);
    }

    const newRefreshToken = await this.generateRefreshToken(refreshToken.user);
    refreshToken.revokedAt = new Date();
    refreshToken.replacedBy = newRefreshToken.token;
    await this.refreshToken.save(refreshToken);

    return new TokenDto({
      ...(await this.generateJwt(refreshToken.user, newRefreshToken.uuid)),
      refreshToken: newRefreshToken.token,
      refreshTokenExpiresAt: newRefreshToken.expiresAt.toUTCString(),
    });
  }

  async login(user: User, ip?: string) {
    let sessionId: string;

    return {
      tokens: await this.generateTokens(user, ip),
    };
  }
  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedLoginException(
        UnauthorizedLoginError.INCORRECT_USER_IDENTIFIER_OR_PASSWORD,
      );
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedLoginException(
        UnauthorizedLoginError.INCORRECT_USER_IDENTIFIER_OR_PASSWORD,
      );
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
