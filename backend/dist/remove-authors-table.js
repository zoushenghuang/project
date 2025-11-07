"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    console.log('🗑️  开始删除 authors 表...');
    try {
        const queryRunner = dataSource.createQueryRunner();
        const tableExists = await queryRunner.hasTable('authors');
        if (tableExists) {
            await queryRunner.dropTable('authors', true);
            console.log('✅ authors 表已删除');
        }
        else {
            console.log('ℹ️  authors 表不存在，无需删除');
        }
        await queryRunner.release();
    }
    catch (error) {
        console.error('❌ 删除 authors 表失败:', error);
    }
    await app.close();
    console.log('🎉 完成！');
}
bootstrap().catch((error) => {
    console.error('❌ 执行失败:', error);
    process.exit(1);
});
//# sourceMappingURL=remove-authors-table.js.map