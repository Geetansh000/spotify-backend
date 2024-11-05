import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ContentType, FILE_STATUS, FileType } from '../enums';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  path: string;

  @Column()
  name: string;

  @Column({ default: '' })
  directory: string;

  @Column({ default: 1 })
  version: number;

  @Column({
    type: 'enum',
    enum: ContentType,
    nullable: false,
  })
  contentType: ContentType;

  @Column({
    type: 'enum',
    enum: FILE_STATUS,
    default: FILE_STATUS.ACTIVE,
  })
  status: FILE_STATUS;

  @Column({ name: 'owner_uuid' })
  @Expose({ name: 'owner_uuid' })
  ownerUUID: string;

  @Column({
    type: 'enum',
    enum: FileType,
  })
  type: FileType;

  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Expose({ name: 'deleted_at' })
  deletedAt?: Date;
}
