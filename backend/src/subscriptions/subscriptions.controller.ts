import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: '创建订阅' })
  @ApiResponse({ status: 201, description: '订阅创建成功' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: '获取订阅列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: '取消订阅' })
  @ApiParam({ name: 'id', description: '订阅ID' })
  @ApiResponse({ status: 200, description: '取消成功' })
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(+id);
  }
}

