import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ description: '作者姓名', example: '张明' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '作者简介', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: '头像URL', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: '职位/头衔', example: '数字生活方式探索者 | 科技爱好者', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '社交媒体链接', required: false })
  @IsObject()
  @IsOptional()
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

