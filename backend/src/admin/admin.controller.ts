import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: '获取统计数据' })
  @ApiResponse({ status: 200, description: '获取成功' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('stats/visitors')
  @ApiOperation({ summary: '获取访客统计' })
  @ApiQuery({ name: 'days', required: false, description: '天数', example: 7 })
  @ApiResponse({ status: 200, description: '获取成功' })
  getVisitorStats(@Query('days') days?: number) {
    return this.adminService.getVisitorStats(days || 7);
  }

  @Get('stats/articles')
  @ApiOperation({ summary: '获取文章统计' })
  @ApiResponse({ status: 200, description: '获取成功' })
  getArticleStats() {
    return this.adminService.getArticleStats();
  }
}
