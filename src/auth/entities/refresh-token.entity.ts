import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
  
  @Entity('refresh_tokens')
  export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
  
    @Column({ length: 50, unique: true })
    token: string;
  
    @Column({ name: 'user_uuid' })
    userUUID: string;
  
    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({ name: 'user_uuid' })
    user: User;
  
    @Column({ name: 'replaced_by', type: 'varchar', nullable: true })
    replacedBy: string;
  
    @Column({ name: 'revoked_at', nullable: true })
    revokedAt: Date;
  
    @Column({ name: 'expires_at' })
    expiresAt: Date;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    get isExpired() {
      return new Date() >= this.expiresAt;
    }
  
    get isRevoked() {
      return !!this.revokedAt;
    }
  
    get isActive() {
      return !this.isRevoked && !this.isExpired;
    }
  }
  