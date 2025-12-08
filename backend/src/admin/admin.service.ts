import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Article } from '../articles/article.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async getStats() {
    const totalArticles = await this.articleRepository.count({
      where: { status: 'published' },
    });

    const totalDrafts = await this.articleRepository.count({
      where: { status: 'draft' },
    });

    const articles = await this.articleRepository.find({
      where: { status: 'published' },
    });
    const totalViews = articles.reduce((sum, article) => sum + article.viewCount, 0);

    // 今日浏览量（简化版，实际应该从访问日志中统计）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayArticles = await this.articleRepository.find({
      where: {
        status: 'published',
        updatedAt: MoreThan(today),
      },
    });
    const todayViews = todayArticles.reduce((sum, article) => sum + article.viewCount, 0);

    return {
      totalArticles,
      totalViews,
      totalDrafts,
      todayViews,
    };
  }

  async getVisitorStats(days: number = 7) {
    // 模拟访客数据，实际应该从访问日志中统计
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // 模拟数据，实际应该查询真实的访问记录
      const views = Math.floor(Math.random() * 100) + 50;

      data.push({
        date: dateStr,
        views,
      });
    }

    return data;
  }

  async getArticleStats() {
    const articles = await this.articleRepository.find({
      where: { status: 'published' },
      relations: ['category'],
      order: { viewCount: 'DESC' },
      take: 10,
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      category: article.category?.name || '-',
      views: article.viewCount,
      createdAt: article.createdAt,
    }));
  }
}
