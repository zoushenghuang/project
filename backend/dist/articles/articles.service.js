"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./article.entity");
const category_entity_1 = require("../categories/category.entity");
const tag_entity_1 = require("../tags/tag.entity");
let ArticlesService = class ArticlesService {
    constructor(articleRepository, categoryRepository, tagRepository) {
        this.articleRepository = articleRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }
    async create(createArticleDto) {
        const category = await this.categoryRepository.findOne({
            where: { id: createArticleDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('分类不存在');
        }
        const article = this.articleRepository.create({
            ...createArticleDto,
            category,
        });
        if (createArticleDto.tagIds && createArticleDto.tagIds.length > 0) {
            const tags = await this.tagRepository.find({
                where: { id: (0, typeorm_2.In)(createArticleDto.tagIds) },
            });
            article.tags = tags;
        }
        return this.articleRepository.save(article);
    }
    async findAll(options) {
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
            queryBuilder.andWhere('(article.title LIKE :search OR article.summary LIKE :search OR article.content LIKE :search)', { search: `%${options.search}%` });
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
    async findOne(id) {
        const article = await this.articleRepository.findOne({
            where: { id },
            relations: ['category', 'tags'],
        });
        if (!article) {
            throw new common_1.NotFoundException('文章不存在');
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
    async findPopular(limit = 5) {
        return this.articleRepository.find({
            relations: ['category', 'tags'],
            order: { viewCount: 'DESC' },
            take: limit,
        });
    }
    async update(id, updateArticleDto) {
        const article = await this.findOne(id);
        const dto = updateArticleDto;
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
                where: { id: (0, typeorm_2.In)(dto.tagIds) },
            });
            article.tags = tags;
        }
        Object.assign(article, updateArticleDto);
        return this.articleRepository.save(article);
    }
    async remove(id) {
        const article = await this.findOne(id);
        await this.articleRepository.remove(article);
        return { message: '文章删除成功' };
    }
    async incrementViewCount(id) {
        const article = await this.findOne(id);
        article.viewCount += 1;
        return this.articleRepository.save(article);
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map