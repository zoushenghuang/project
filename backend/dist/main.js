"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Minimal 博客 API')
        .setDescription('个人博客系统的 RESTful API 文档')
        .setVersion('1.0')
        .addTag('articles', '文章相关接口')
        .addTag('categories', '分类相关接口')
        .addTag('tags', '标签相关接口')
        .addTag('subscriptions', '订阅相关接口')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        customSiteTitle: 'Minimal 博客 API 文档',
        customfavIcon: '/favicon.ico',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 应用运行在: http://localhost:${port}`);
    console.log(`📚 API 文档地址: http://localhost:${port}/api-docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map