import { IsNotEmpty, IsOptional, IsUUID, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  @IsString()
  artistName: string;

  @IsOptional()  
  @IsString()
  image: string;
}
