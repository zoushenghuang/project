import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Category } from '../categories/category.entity';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: createArticleDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      category,
    });

    if (createArticleDto.tagIds && createArticleDto.tagIds.length > 0) {
      const tags = await this.tagRepository.find({
        where: { id: In(createArticleDto.tagIds) },
      });
      article.tags = tags;
    }

    return this.articleRepository.save(article);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    categoryId?: number;
    tagId?: number;
    isFeatured?: boolean;
    search?: string;
    status?: string;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .orderBy('article.createdAt', 'DESC');

    if (options.categoryId) {
      queryBuilder.where('category.id = :categoryId', {
        categoryId: options.categoryId,
      });
    }

    if (options.tagId) {
      queryBuilder
        .innerJoin('article.tags', 'tag')
        .andWhere('tag.id = :tagId', { tagId: options.tagId });
    }

    if (options.isFeatured !== undefined) {
      queryBuilder.andWhere('article.isFeatured = :isFeatured', {
        isFeatured: options.isFeatured,
      });
    }

    if (options.search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.summary LIKE :search OR article.content LIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options.status) {
      queryBuilder.andWhere('article.status = :status', {
        status: options.status,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    return article;
  }

  async findFeatured() {
    return this.articleRepository.find({
      where: { isFeatured: true },
      relations: ['category', 'tags'],
      order: { createdAt: 'DESC' },
      take: 1,
    });
  }

  async findPopular(limit: number = 5) {
    return this.articleRepository.find({
      relations: ['category', 'tags'],
      order: { viewCount: 'DESC' },
      take: limit,
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);

    const dto = updateArticleDto as any;

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (category) {
        article.category = category;
      }
    }

    if (dto.tagIds) {
      const tags = await this.tagRepository.find({
        where: { id: In(dto.tagIds) },
      });
      article.tags = tags;
    }

    Object.assign(article, updateArticleDto);

    return this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
    return { message: '文章删除成功' };
  }

  async incrementViewCount(id: number) {
    const article = await this.findOne(id);
    article.viewCount += 1;
    return this.articleRepository.save(article);
  }

  async publish(id: number) {
    const article = await this.findOne(id);
    article.status = 'published';
    return this.articleRepository.save(article);
  }
}

