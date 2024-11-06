import { IsOptional, IsString } from 'class-validator';

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  artistName?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
