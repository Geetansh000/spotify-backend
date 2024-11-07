import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import {
  CreateArtistDto,
  UpdateArtistDto,
  DeactivateArtistDto,
  ActivateArtistDto,
} from './dto';

import { AuthProtect } from 'src/auth/decorators/auth-protect.decorator';
import { ArtistValidation } from './enums';
import { Artist } from './entities/artist.entity';
import { string } from 'joi';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @AuthProtect()
  @Post('register')
  create(@Body() createArtistDto: CreateArtistDto, @Req() req) {
    const userUuid = req.user.uuid;
    return this.artistService.create(createArtistDto, userUuid);
  }

  @AuthProtect()
  @Put()
  update(@Req() req, @Body() updateArtistDto: UpdateArtistDto) {
    const artistId = req.user.uuid;
    return this.artistService.update(artistId, updateArtistDto);
  }

  @AuthProtect()
  @Post('/:artistUuid/activate')
  activateArtist(
    @Req() req,
    @Param('artistUuid') artistUuid: string,
    @Body() activateDto: ActivateArtistDto,
  ) {
    return this.artistService.activateArtist(artistUuid, activateDto);
  }

  @AuthProtect()
  @Post('/:artistUuid/deactivate')
  deactivateArtist(
    @Req() req,
    @Param('artistUuid') artistUuid: string,
    @Body() deactivateDto: DeactivateArtistDto,
  ) {
    return this.artistService.deactivateArtist(artistUuid, deactivateDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Artist> {
    const artist = this.artistService.findOneByUuid(id);
    if (!artist) {
      throw new NotFoundException(ArtistValidation.ARTIST_NOT_FOUND);
    }

    return artist;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
