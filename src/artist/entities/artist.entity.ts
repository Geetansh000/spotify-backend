import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  artistName: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Column({default : false, name : 'is_active'})
  @Expose({name : 'is_active'})
  isActive : boolean

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_uuid' }) 
  user: User;
}
