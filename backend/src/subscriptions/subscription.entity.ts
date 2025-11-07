import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('subscriptions')
export class Subscription {
  @ApiProperty({ description: '订阅ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '邮箱地址' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: '订阅时间' })
  @CreateDateColumn()
  subscribedAt: Date;
}

