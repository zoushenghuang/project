import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: '标签名称', example: '效率' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

