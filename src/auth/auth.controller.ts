import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Headers,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { RefreshTokenNotProvidedException } from './exceptions';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './decorators/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { TokenDto } from './dto/jwt.dto';
import { RefreshTokenNotProvidedExceptionFilter } from './exceptions/filters/refresh-token-not-provided.exception-filter';
import { RefreshTokenExceptionFilter } from './exceptions/filters/refresh-token.excption-filter';
import { UnauthorizedLoginExceptionFilter } from './exceptions/filters/unauthorized-login.exception-filter';
import { AuthProtect } from './decorators/auth-protect.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const ip: string = (req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress) as string;
    const user = await this.authService.create(createUserDto);
    const tokens = await this.authService.generateTokens(user, ip);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      path: '/auth/access-token/refresh',
    });
    return {
      ...user,
      ...tokens.toJSON(),
    };
  }

  @UseGuards(LocalAuthGuard)
  @UseFilters(UnauthorizedLoginExceptionFilter)
  @Post('login')
  async loginUser(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() _loginDto: LoginDto,
    @AuthUser() user: User,
  ) {
    try {
      const ip = (req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket.remoteAddress) as string;

      let tokens: TokenDto;

      const { tokens: authTokens } = await this.authService.login(user, ip);
      tokens = authTokens;

      if (tokens.refreshToken) {
        response.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          path: '/auth/access-token/refresh',
        });
      }
      
      delete user.password;
      
      return {
        ...user,
        ...tokens.toJSON(),
      };
    } catch (error) {
      if (error.response) {
        console.error('LoginError:', error.response.data);
      } else {
        console.error('LoginError:', error);
      }
      throw error;
    }
  }
  @UseFilters(
    RefreshTokenNotProvidedExceptionFilter,
    RefreshTokenExceptionFilter,
  )
  @Post('/access-token/refresh')
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Headers('authorization') authorization: string,
  ): Promise<any> {
    const refreshToken = authorization?.split(' ')[1] || null;

    if (!refreshToken || refreshToken === 'null') {
      throw new RefreshTokenNotProvidedException();
    }
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      path: '/auth/access-token/refresh',
      expires: new Date(tokens.refreshTokenExpiresAt),
    });
    return tokens;
  }

  @AuthProtect()
  @Get()
  async findAll() {
    return await this.authService.findAll();
  }
}
