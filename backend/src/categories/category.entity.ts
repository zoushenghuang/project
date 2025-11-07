import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../articles/article.entity';

@Entity('categories')
export class Category {
  @ApiProperty({ description: '分类ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '分类名称' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: '分类描述', required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: '分类颜色', required: false })
  @Column({ nullable: true })
  color: string;

  @ApiProperty({ description: '文章列表' })
  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}

