import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateArtistDto,UpdateArtistDto,DeactivateArtistDto,ActivateArtistDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ArtistValidation } from './enums';
import { comparePasswords } from 'src/shared/helpers/password.helper';

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

    const alreadyExist = this.artistRepository.findOneBy({ user : user});
    if (alreadyExist) {
      throw new ConflictException(ArtistValidation.ARTIST_ALREADY_EXIST)
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
    artistUuid: string,
    deactivateDto: DeactivateArtistDto,
  ): Promise<{ success: boolean; artist: Artist }> {
    const artist = await this.artistRepository.findOne({
      where: { uuid : artistUuid },
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
    artistUuid: string,
    activateDto: ActivateArtistDto,
  ): Promise<{ success: boolean; artist: Artist }> {
    const artist = await this.artistRepository.findOne({
      where: { uuid : artistUuid },
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
