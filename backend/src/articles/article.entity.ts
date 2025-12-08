import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/category.entity';
import { Tag } from '../tags/tag.entity';

@Entity('articles')
export class Article {
  @ApiProperty({ description: '文章ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '文章标题' })
  @Column()
  title: string;

  @ApiProperty({ description: '文章摘要' })
  @Column('text')
  summary: string;

  @ApiProperty({ description: '文章内容' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '封面图片URL' })
  @Column({ nullable: true })
  coverImage: string;

  @ApiProperty({ description: '是否特色文章' })
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: '文章状态', enum: ['draft', 'published'] })
  @Column({ default: 'published' })
  status: string;

  @ApiProperty({ description: '阅读量' })
  @Column({ default: 0 })
  viewCount: number;

  @ApiProperty({ description: '评论数' })
  @Column({ default: 0 })
  commentCount: number;

  @ApiProperty({ description: '分类' })
  @ManyToOne(() => Category, (category) => category.articles)
  category: Category;

  @ApiProperty({ description: '标签列表' })
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}

