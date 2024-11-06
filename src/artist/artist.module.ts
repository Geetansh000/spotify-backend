import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Artist,User])],
  controllers: [ArtistController],
  providers: [ArtistService,UserService],
})
export class ArtistModule {}
