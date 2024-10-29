import {
  IsArray,
  IsDate,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateSongEntryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsNotEmpty()
  artists: string[];

  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  duration: Date;
}
