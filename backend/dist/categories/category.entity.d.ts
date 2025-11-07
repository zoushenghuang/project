import { Article } from '../articles/article.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    color: string;
    articles: Article[];
}
