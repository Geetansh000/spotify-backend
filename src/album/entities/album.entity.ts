import { Expose } from 'class-transformer';
import { Song } from 'src/songs/entities/songs.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  @Expose({ name: 'release_date' })
  releaseDate: Date;

  @Column({ nullable: false })
  duration: string;

  @Column({ nullable: false })
  songsCount: number;

  @Column({ nullable: false })
  artist_uuid: string;

//   @Column({ nullable: false })
//   songs_uuid: string[];

//   @OneToMany(() => Song)
//   @JoinColumn({ name: 'songs_uuid' })
//   songs: Song[];
}
