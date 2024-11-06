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
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AuthProtect } from 'src/auth/decorators/auth-protect.decorator';
import { ArtistValidation } from './enums/validation.enum';
import { Artist } from './entities/artist.entity';
import { ActivateArtistDto } from './dto/activate-artist.dto';
import { DeactivateArtistDto } from './dto/deactivate-artist-dto';

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
  @Post('activate')
  activateArtist(@Req() req, @Body() activateDto: ActivateArtistDto) {
    const id = req.user.uuid;
    return this.artistService.activateArtist(id, activateDto);
  }

  @AuthProtect()
  @Post('deactivate')
  deactivateArtist(@Req() req, @Body() deactivateDto: DeactivateArtistDto) {
    const id = req.user.uuid;
    return this.artistService.deactivateArtist(id, deactivateDto);
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
