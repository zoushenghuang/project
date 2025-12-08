import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Category } from '../categories/category.entity';
import { Tag } from '../tags/tag.entity';
export declare class ArticlesService {
    private articleRepository;
    private categoryRepository;
    private tagRepository;
    constructor(articleRepository: Repository<Article>, categoryRepository: Repository<Category>, tagRepository: Repository<Tag>);
    create(createArticleDto: CreateArticleDto): Promise<Article>;
    findAll(options: {
        page?: number;
        limit?: number;
        categoryId?: number;
        tagId?: number;
        isFeatured?: boolean;
        search?: string;
        status?: string;
    }): Promise<{
        data: Article[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Article>;
    findFeatured(): Promise<Article[]>;
    findPopular(limit?: number): Promise<Article[]>;
    update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article>;
    remove(id: number): Promise<{
        message: string;
    }>;
    incrementViewCount(id: number): Promise<Article>;
    publish(id: number): Promise<Article>;
}
