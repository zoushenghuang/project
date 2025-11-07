# 博客后端 API

基于 NestJS + TypeScript + SQLite 的个人博客后端系统。

## 技术栈

- **框架**: NestJS
- **语言**: TypeScript
- **数据库**: SQLite
- **ORM**: TypeORM
- **API 文档**: Swagger/OpenAPI

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run start:dev
```

应用将在 `http://localhost:3001` 启动。

### API 文档

启动后访问 `http://localhost:3001/api-docs` 查看 Swagger API 文档。

## 项目结构

```
backend/
├── src/
│   ├── articles/          # 文章模块
│   │   ├── dto/          # 数据传输对象
│   │   ├── article.entity.ts
│   │   ├── articles.controller.ts
│   │   ├── articles.service.ts
│   │   └── articles.module.ts
│   ├── categories/        # 分类模块
│   ├── tags/             # 标签模块
│   ├── authors/          # 作者模块
│   ├── subscriptions/    # 订阅模块
│   ├── app.module.ts     # 根模块
│   └── main.ts           # 入口文件
├── package.json
└── tsconfig.json
```

## API 接口

### 文章接口

- `GET /articles` - 获取文章列表（支持分页、分类筛选、搜索）
- `GET /articles/featured` - 获取特色文章
- `GET /articles/popular` - 获取热门文章
- `GET /articles/:id` - 获取单篇文章
- `POST /articles` - 创建文章
- `PATCH /articles/:id` - 更新文章
- `DELETE /articles/:id` - 删除文章
- `POST /articles/:id/view` - 增加阅读量

### 分类接口

- `GET /categories` - 获取分类列表
- `GET /categories/:id` - 获取单个分类
- `POST /categories` - 创建分类
- `PATCH /categories/:id` - 更新分类
- `DELETE /categories/:id` - 删除分类

### 标签接口

- `GET /tags` - 获取标签列表
- `GET /tags/popular` - 获取热门标签
- `GET /tags/:id` - 获取单个标签
- `POST /tags` - 创建标签
- `PATCH /tags/:id` - 更新标签
- `DELETE /tags/:id` - 删除标签

### 作者接口

- `GET /authors` - 获取作者列表
- `GET /authors/:id` - 获取单个作者
- `POST /authors` - 创建作者
- `PATCH /authors/:id` - 更新作者
- `DELETE /authors/:id` - 删除作者

### 订阅接口

- `GET /subscriptions` - 获取订阅列表
- `POST /subscriptions` - 创建订阅
- `DELETE /subscriptions/:id` - 取消订阅

## 数据库

数据库文件 `blog.db` 会在首次启动时自动创建。

## 环境变量

可以通过环境变量配置端口：

```bash
PORT=3001 npm run start:dev
```

## 开发

```bash
# 开发模式（热重载）
npm run start:dev

# 构建
npm run build

# 生产模式
npm run start:prod
```

## Swagger 配置

Swagger 文档已配置在 `main.ts` 中，包含：

- API 标题和描述
- 版本信息
- 标签分组
- 接口文档自动生成

访问 `http://localhost:3001/api-docs` 查看完整的 API 文档。

