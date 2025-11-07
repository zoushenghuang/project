import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../articles/article.entity';

@Entity('tags')
export class Tag {
  @ApiProperty({ description: '标签ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '标签名称' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: '文章列表' })
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}

