# 博客后台管理系统

完整的博客后台管理系统，包含前端和后端。

## 系统架构

```
git-blog/
├── admin-frontend/          # 后台管理前端 (React + Ant Design + TailwindCSS)
├── backend/                 # 后端 API (NestJS + TypeORM + SQLite)
├── frontend/                # 博客前端 (Next.js)
└── server/                  # 服务器配置
```

## 技术栈

### 前端 (admin-frontend)
- **框架**: React 18 + Vite
- **UI 库**: Ant Design 5
- **样式**: TailwindCSS
- **路由**: React Router v6
- **图表**: Recharts
- **HTTP**: Axios
- **端口**: 3002

### 后端 (backend)
- **框架**: NestJS 10
- **ORM**: TypeORM
- **数据库**: SQLite (better-sqlite3)
- **API 文档**: Swagger
- **端口**: 3001

## 功能模块

### 1. 分析概览 (Dashboard)
- **数据概览**
  - 总文章数
  - 总浏览量
  - 草稿数
  - 今日浏览量
  
- **访客统计**
  - 最近 7 天访客趋势图
  - 可视化数据展示
  
- **文章分析**
  - 热门文章排行
  - 浏览量统计

### 2. 文章管理
- **文章列表**
  - 分页展示
  - 搜索功能（标题搜索）
  - 分类筛选
  - 显示：ID、标题、分类、标签、创建时间、浏览量
  
- **文章操作**
  - 新建文章
  - 编辑文章
  - 删除文章
  - 查看文章
  - Markdown 编辑器

### 3. 草稿管理
- **草稿列表**
  - 分页展示
  - 搜索功能
  - 显示：ID、标题、分类、标签、创建时间、更新时间
  
- **草稿操作**
  - 新建草稿
  - 编辑草稿
  - 发布草稿（转为正式文章）
  - 删除草稿
  - Markdown 编辑器

## 快速开始

### 1. 安装依赖

#### 后端
```bash
cd backend
npm install
```

#### 前端管理系统
```bash
cd admin-frontend
npm install
```

### 2. 启动服务

#### 启动后端 API
```bash
cd backend
npm run start:dev
```
后端将运行在 http://localhost:3001

#### 启动后台管理前端
```bash
cd admin-frontend
npm run dev
```
后台管理系统将运行在 http://localhost:3002

### 3. 访问系统

- **后台管理系统**: http://localhost:3002
- **API 文档**: http://localhost:3001/api
- **博客前端**: http://localhost:3000 (需要单独启动)

## API 接口

### Admin 统计接口

#### 获取统计数据
```
GET /api/admin/stats
```
返回：
```json
{
  "totalArticles": 10,
  "totalViews": 1000,
  "totalDrafts": 5,
  "todayViews": 50
}
```

#### 获取访客统计
```
GET /api/admin/stats/visitors?days=7
```
返回：
```json
[
  { "date": "2024-01-01", "views": 100 },
  { "date": "2024-01-02", "views": 120 }
]
```

#### 获取文章统计
```
GET /api/admin/stats/articles
```
返回热门文章列表

### Articles 接口

#### 获取文章列表
```
GET /api/articles?page=1&limit=10&status=published
GET /api/articles?page=1&limit=10&status=draft
```

#### 创建文章
```
POST /api/articles
Body: {
  "title": "文章标题",
  "content": "文章内容",
  "summary": "文章摘要",
  "categoryId": 1,
  "tagIds": [1, 2],
  "status": "published" | "draft"
}
```

#### 更新文章
```
PATCH /api/articles/:id
Body: { ... }
```

#### 发布文章
```
PATCH /api/articles/:id/publish
```

#### 删除文章
```
DELETE /api/articles/:id
```

## 数据库结构

### Articles 表
- `id`: 主键
- `title`: 标题
- `content`: 内容
- `summary`: 摘要
- `coverImage`: 封面图
- `isFeatured`: 是否特色
- `status`: 状态 (draft/published) **新增**
- `viewCount`: 浏览量
- `commentCount`: 评论数
- `categoryId`: 分类ID
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### Categories 表
- `id`: 主键
- `name`: 分类名称
- `description`: 描述

### Tags 表
- `id`: 主键
- `name`: 标签名称

## 开发说明

### 后端开发

#### 添加新的 API 接口
1. 在对应的 controller 中添加路由
2. 在对应的 service 中实现业务逻辑
3. 使用 Swagger 装饰器添加 API 文档

#### 数据库迁移
数据库使用 `synchronize: true` 自动同步，开发环境会自动创建/更新表结构。

### 前端开发

#### 添加新页面
1. 在 `src/pages/` 下创建页面组件
2. 在 `src/App.tsx` 中添加路由
3. 在 `src/layouts/BasicLayout.tsx` 中添加菜单项

#### 添加新的 API 调用
在 `src/services/api.ts` 中添加 API 方法

#### 样式开发
- 使用 TailwindCSS 工具类
- Ant Design 组件自带样式
- 避免两者冲突（已配置 `preflight: false`）

## 部署

### 后端部署
```bash
cd backend
npm run build
npm run start:prod
```

### 前端部署
```bash
cd admin-frontend
npm run build
npm run preview
```

生产环境建议使用 Nginx 反向代理。

## 环境变量

### 后端 (.env)
```
PORT=3001
DATABASE_PATH=./blog.db
```

### 前端 (.env.development)
```
VITE_API_URL=http://localhost:3001
```

## 注意事项

1. **数据库**: 使用 SQLite，数据文件为 `backend/blog.db`
2. **CORS**: 后端已配置 CORS，允许前端跨域访问
3. **API 前缀**: 所有 API 接口都以 `/api` 开头
4. **状态管理**: 前端使用 React Hooks，无需额外状态管理库
5. **权限**: 当前版本未实现权限控制，后续可添加 JWT 认证

## 后续优化

- [ ] 添加用户认证和权限管理
- [ ] 实现真实的访客统计（使用访问日志）
- [ ] 添加文章分类和标签管理页面
- [ ] 支持图片上传
- [ ] 添加 Markdown 预览功能
- [ ] 实现评论管理
- [ ] 添加数据导出功能
- [ ] 优化移动端适配

## 常见问题

### Q: 前端无法连接后端？
A: 检查后端是否启动，端口是否正确（3001）

### Q: 数据库表结构变化后如何更新？
A: 开发环境会自动同步，生产环境需要手动迁移

### Q: 如何修改端口？
A: 
- 后端: 修改 `backend/src/main.ts` 中的端口
- 前端: 修改 `admin-frontend/vite.config.ts` 中的端口

## 技术支持

如有问题，请查看：
- [NestJS 文档](https://docs.nestjs.com/)
- [Ant Design 文档](https://ant.design/)
- [React Router 文档](https://reactrouter.com/)
- [TailwindCSS 文档](https://tailwindcss.com/)
