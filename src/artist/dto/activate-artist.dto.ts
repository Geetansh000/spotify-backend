import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateArtistDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
