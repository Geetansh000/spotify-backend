import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from './database/database.source';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from 'src/common/middleware/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AlbumModule } from './album/album.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION'),
        },
      }),
    }),
    SongsModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => dataSourceOptions,
    }),
    AuthModule,
    AlbumModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).exclude('/', '/v1/').forRoutes('*');
  }

  // consumer.apply(LoggerMiddleware).forRoutes('songs'); //option1
  // consumer
  //   .apply(LoggerMiddleware)
  //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); //option 2
  // consumer.apply(LoggerMiddleware).forRoutes(SongsController); //option 3
}
