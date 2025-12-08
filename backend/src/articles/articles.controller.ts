import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 201, description: '文章创建成功' })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取文章列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量', example: 10 })
  @ApiQuery({ name: 'categoryId', required: false, description: '分类ID' })
  @ApiQuery({ name: 'tagId', required: false, description: '标签ID' })
  @ApiQuery({ name: 'isFeatured', required: false, description: '是否特色文章' })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键词' })
  @ApiQuery({ name: 'status', required: false, description: '文章状态', example: 'published' })
  @ApiResponse({ status: 200, description: '获取成功' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: number,
    @Query('tagId') tagId?: number,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.articlesService.findAll({
      page,
      limit,
      categoryId,
      tagId,
      isFeatured,
      search,
      status,
    });
  }

  @Get('featured')
  @ApiOperation({ summary: '获取特色文章' })
  @ApiResponse({ status: 200, description: '获取成功' })
  findFeatured() {
    return this.articlesService.findFeatured();
  }

  @Get('popular')
  @ApiOperation({ summary: '获取热门文章' })
  @ApiQuery({ name: 'limit', required: false, description: '数量', example: 5 })
  @ApiResponse({ status: 200, description: '获取成功' })
  findPopular(@Query('limit') limit?: number) {
    return this.articlesService.findPopular(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单篇文章' })
  @ApiParam({ name: 'id', description: '文章ID' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章' })
  @ApiParam({ name: 'id', description: '文章ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: '发布文章' })
  @ApiParam({ name: 'id', description: '文章ID' })
  @ApiResponse({ status: 200, description: '发布成功' })
  publish(@Param('id') id: string) {
    return this.articlesService.publish(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  @ApiParam({ name: 'id', description: '文章ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @Post(':id/view')
  @ApiOperation({ summary: '增加文章阅读量' })
  @ApiParam({ name: 'id', description: '文章ID' })
  @ApiResponse({ status: 200, description: '操作成功' })
  incrementViewCount(@Param('id') id: string) {
    return this.articlesService.incrementViewCount(+id);
  }
}

