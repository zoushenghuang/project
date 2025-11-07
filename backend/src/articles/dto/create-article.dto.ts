import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: '文章标题', example: '如何在数字时代保持专注与高效' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '文章摘要', example: '探索在信息爆炸的时代，如何通过科学的方法和工具提高工作效率...' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ description: '文章内容', example: '文章正文内容...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '封面图片URL', required: false })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ description: '是否特色文章', default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ description: '分类ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ description: '标签ID列表', type: [Number], example: [1, 2, 3] })
  @IsOptional()
  tagIds?: number[];
}

