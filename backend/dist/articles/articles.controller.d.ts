import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: CreateArticleDto): Promise<import("./article.entity").Article>;
    findAll(page?: number, limit?: number, categoryId?: number, tagId?: number, isFeatured?: boolean, search?: string): Promise<{
        data: import("./article.entity").Article[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findFeatured(): Promise<import("./article.entity").Article[]>;
    findPopular(limit?: number): Promise<import("./article.entity").Article[]>;
    findOne(id: string): Promise<import("./article.entity").Article>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<import("./article.entity").Article>;
    remove(id: string): Promise<{
        message: string;
    }>;
    incrementViewCount(id: string): Promise<import("./article.entity").Article>;
}
