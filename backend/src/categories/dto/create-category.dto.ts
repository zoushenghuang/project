import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称', example: '科技创新' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '分类描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '分类颜色', example: 'blue', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}

