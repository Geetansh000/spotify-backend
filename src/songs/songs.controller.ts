import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongEntryDto } from './dto';
import { ValidationError } from 'class-validator';

@Controller('songs')
export class SongsController {
  constructor(private songServices: SongsService) {}
  @Get()
  async getAllSongs() {
    try {
      return this.songServices.getAllSongs;
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.FORBIDDEN);
    }
  }
  @Post()
  async createSongEntry(@Body() createSongEntryDto: CreateSongEntryDto) {
    return this.songServices.createSongEntry(createSongEntryDto);
  }
  @Get('/:id')
  async getSongById(@Param('id',ParseIntPipe) id) {
    return this.songServices.getSongById(id);
  }
  @Put('/:id')
  async updateSong(@Param('id') id) {
    return `update ${id}`;
  }
  @Delete('/:id')
  async deleteSong(@Param('id') id) {
    return `delete ${id}`;
  }
}
