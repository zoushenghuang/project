import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('authors')
export class Author {
  @ApiProperty({ description: '作者ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '作者姓名' })
  @Column()
  name: string;

  @ApiProperty({ description: '作者简介', required: false })
  @Column('text', { nullable: true })
  bio: string;

  @ApiProperty({ description: '头像URL', required: false })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({ description: '职位/头衔', required: false })
  @Column({ nullable: true })
  title: string;

  @ApiProperty({ description: '社交媒体链接', required: false })
  @Column('simple-json', { nullable: true })
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

