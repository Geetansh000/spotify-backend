import { IsNotEmpty, IsString } from 'class-validator';

export class DeactivateArtistDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
