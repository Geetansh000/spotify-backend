import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { ValidationError } from 'class-validator';
import { ArtistValidation } from './enums/validation.enum';
import { DeactivateArtistDto } from './dto/deactivate-artist-dto';
import { comparePasswords } from 'src/shared/helpers/password.helper';
import { ActivateArtistDto } from './dto/activate-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private readonly userService: UserService,
  ) {}

  async create(createArtistDto: CreateArtistDto, userUuid: string) {
    const user = await this.userService.getByUUID(userUuid);

    if (!user) {
      throw new Error('User not found');
    }

    const artist = this.artistRepository.create({
      ...createArtistDto,
      user,
    });

    return this.artistRepository.save(artist);
  }

  findAll() {
    return `This action returns all artist`;
  }

  async findOneByUuid(id: string) {
    const artist = await this.artistRepository.findOne({
      where: { uuid: id },
      relations: ['user'],
    });
    delete artist.user.password;
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findOne({
      where: { user: { uuid: id } },
      relations: ['user'],
    });
    if (!artist) {
      throw new NotFoundException(ArtistValidation.ARTIST_NOT_FOUND);
    }
    delete artist.user.password;
    Object.assign(artist, updateArtistDto);
    return await this.artistRepository.save(artist);
  }

  async deactivateArtist(
    id: string,
    deactivateDto: DeactivateArtistDto,
  ): Promise<{ success: boolean; artist: Artist }> {
    const artist = await this.artistRepository.findOne({
      where: { user: { uuid: id } },
      relations: ['user'],
    });

    if (!artist) {
      throw new NotFoundException(ArtistValidation.ARTIST_NOT_FOUND);
    }

    const isPasswordMatch = await comparePasswords(
      deactivateDto.password,
      artist.user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException(ArtistValidation.PASSWORD_DOES_NOT_MATCH);
    }

    artist.isActive = false;
    await this.artistRepository.save(artist);
    delete artist.user.password;
    return { success: true, artist };
  }

  async activateArtist(
    id: string,
    activateDto: ActivateArtistDto,
  ): Promise<{ success: boolean; artist: Artist }> {
    const artist = await this.artistRepository.findOne({
      where: { user: { uuid: id } },
      relations: ['user'],
    });

    if (!artist) {
      throw new NotFoundException(ArtistValidation.ARTIST_NOT_FOUND);
    }

    const isPasswordMatch = await comparePasswords(
      activateDto.password,
      artist.user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException(ArtistValidation.PASSWORD_DOES_NOT_MATCH);
    }

    artist.isActive = true;
    await this.artistRepository.save(artist);
    delete artist.user.password;
    return { success: true, artist };
  }
}
