export declare class CreateArticleDto {
    title: string;
    summary: string;
    content: string;
    coverImage?: string;
    isFeatured?: boolean;
    categoryId: number;
    tagIds?: number[];
}
