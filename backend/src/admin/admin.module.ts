import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Article } from '../articles/article.entity';
import { Category } from '../categories/category.entity';
import { Tag } from '../tags/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, Tag])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
