import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from 'src/album/entities/album.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  title: string;

  @Column({ name: 'release_date', nullable: false })
  @Expose({ name: 'release_date' })
  releaseDate: Date;

  @Column({ nullable: false })
  duration: string;

  @Column({ nullable: false })
  views: number;

  @Column({ nullable: false })
  language: number;

  // @Column({ nullable: false })
  // artist_uuids: string[];

  // @Column({ nullable: false })
  // file_uuids: string[];
}
