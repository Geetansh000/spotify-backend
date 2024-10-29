import { Injectable } from '@nestjs/common';
import { CreateSongEntryDto } from './dto';

@Injectable()
export class SongsService {
  private songs = [];

  async createSongEntry(createSongEntryDto: CreateSongEntryDto) {
    this.songs.push();
    return this.songs;
  }
  async getAllSongs() {
    console.log('abc ', this.songs);
    return this.songs;
  }
  async getSongById(id: number) {
    return this.songs[id];
  }
}
