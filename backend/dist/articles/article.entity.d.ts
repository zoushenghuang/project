import { Category } from '../categories/category.entity';
import { Tag } from '../tags/tag.entity';
export declare class Article {
    id: number;
    title: string;
    summary: string;
    content: string;
    coverImage: string;
    isFeatured: boolean;
    viewCount: number;
    commentCount: number;
    category: Category;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}
