import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🗑️  开始删除 authors 表...');

  try {
    // 检查表是否存在
    const queryRunner = dataSource.createQueryRunner();
    const tableExists = await queryRunner.hasTable('authors');

    if (tableExists) {
      // 删除 authors 表
      await queryRunner.dropTable('authors', true);
      console.log('✅ authors 表已删除');
    } else {
      console.log('ℹ️  authors 表不存在，无需删除');
    }

    await queryRunner.release();
  } catch (error) {
    console.error('❌ 删除 authors 表失败:', error);
  }

  await app.close();
  console.log('🎉 完成！');
}

bootstrap().catch((error) => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});

