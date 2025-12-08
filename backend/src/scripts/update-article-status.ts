import { DataSource } from 'typeorm';
import { Article } from '../articles/article.entity';
import { Category } from '../categories/category.entity';
import { Tag } from '../tags/tag.entity';

async function updateArticleStatus() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'blog.db',
    entities: [Article, Category, Tag],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ 数据库连接成功');

    const articleRepository = dataSource.getRepository(Article);

    // 更新所有没有 status 字段或 status 为 null 的文章
    const result = await articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ status: 'published' })
      .where("status IS NULL OR status = ''")
      .execute();

    console.log(`✅ 已更新 ${result.affected} 篇文章的状态为 'published'`);

    // 查询统计
    const total = await articleRepository.count();
    const published = await articleRepository.count({ where: { status: 'published' } });
    const draft = await articleRepository.count({ where: { status: 'draft' } });

    console.log('\n📊 文章统计:');
    console.log(`   总文章数: ${total}`);
    console.log(`   已发布: ${published}`);
    console.log(`   草稿: ${draft}`);

    await dataSource.destroy();
    console.log('\n✅ 数据迁移完成！');
  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    process.exit(1);
  }
}

updateArticleStatus();
