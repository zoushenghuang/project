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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const category_entity_1 = require("../categories/category.entity");
const tag_entity_1 = require("../tags/tag.entity");
let Article = class Article {
};
exports.Article = Article;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文章ID' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Article.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文章标题' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文章摘要' }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Article.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '文章内容' }),
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Article.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '封面图片URL' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Article.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否特色文章' }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Article.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '阅读量' }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "viewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '评论数' }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "commentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '分类' }),
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.articles),
    __metadata("design:type", category_entity_1.Category)
], Article.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '标签列表' }),
    (0, typeorm_1.ManyToMany)(() => tag_entity_1.Tag, (tag) => tag.articles),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Article.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Article.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '更新时间' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Article.prototype, "updatedAt", void 0);
exports.Article = Article = __decorate([
    (0, typeorm_1.Entity)('articles')
], Article);
//# sourceMappingURL=article.entity.js.map