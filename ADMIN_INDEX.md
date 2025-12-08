# 博客后台管理系统 - 文档索引

## 📚 快速导航

### 🚀 开始使用
1. **[安装指南 (INSTALL.md)](./INSTALL.md)** - 安装依赖和环境配置
2. **[快速启动 (START_ADMIN.md)](./START_ADMIN.md)** - 快速启动系统
3. **[项目总结 (SUMMARY.md)](./SUMMARY.md)** - 项目概览和功能说明

### 📖 详细文档
- **[系统文档 (ADMIN_SYSTEM_README.md)](./ADMIN_SYSTEM_README.md)** - 完整的系统架构和 API 文档
- **[前端文档 (admin-frontend/README.md)](./admin-frontend/README.md)** - 前端项目说明
- **[后端文档 (backend/README.md)](./backend/README.md)** - 后端项目说明

## 🎯 使用流程

### 第一次使用
```
1. 阅读 INSTALL.md → 安装依赖
2. 运行 ./start-admin.sh → 启动系统
3. 访问 http://localhost:3002 → 开始使用
```

### 日常开发
```
1. 启动系统: ./start-admin.sh
2. 修改代码（自动热重载）
3. 测试功能
4. 提交代码
```

## 📁 项目结构

```
git-blog/
├── admin-frontend/              # 后台管理前端
│   ├── src/
│   │   ├── layouts/            # 布局组件
│   │   ├── pages/              # 页面组件
│   │   │   ├── Dashboard/      # 分析概览
│   │   │   ├── Article/        # 文章管理
│   │   │   └── Draft/          # 草稿管理
│   │   ├── services/           # API 服务
│   │   └── utils/              # 工具函数
│   ├── package.json
│   └── README.md
│
├── backend/                     # 后端 API
│   ├── src/
│   │   ├── admin/              # Admin 模块（新增）
│   │   ├── articles/           # 文章模块
│   │   ├── categories/         # 分类模块
│   │   ├── tags/               # 标签模块
│   │   └── app.module.ts
│   ├── blog.db                 # SQLite 数据库
│   └── package.json
│
├── frontend/                    # 博客前端（原有）
├── server/                      # 服务器配置（原有）
│
└── 文档/
    ├── ADMIN_INDEX.md          # 本文档（导航索引）
    ├── INSTALL.md              # 安装指南
    ├── START_ADMIN.md          # 快速启动
    ├── SUMMARY.md              # 项目总结
    ├── ADMIN_SYSTEM_README.md  # 系统文档
    └── start-admin.sh          # 启动脚本
```

## 🎨 功能模块

### 1. 分析概览 (Dashboard)
- 数据概览卡片
- 访客统计图表
- 热门文章列表

### 2. 文章管理
- 文章列表（分页、搜索、筛选）
- 新建/编辑/删除文章
- Markdown 编辑器

### 3. 草稿管理
- 草稿列表（分页、搜索）
- 新建/编辑/删除草稿
- 发布草稿为文章

## 🔗 访问地址

- **后台管理系统**: http://localhost:3002
- **API 文档**: http://localhost:3001/api
- **博客前端**: http://localhost:3000

## 💻 技术栈

### 前端
- React 18 + TypeScript
- Ant Design 5
- TailwindCSS
- Vite
- React Router v6

### 后端
- NestJS 10
- TypeORM
- SQLite
- Swagger

## 📝 常用命令

### 启动系统
```bash
./start-admin.sh
```

### 安装依赖
```bash
cd admin-frontend && npm install
```

### 手动启动
```bash
# 后端
cd backend && npm run start:dev

# 前端
cd admin-frontend && npm run dev
```

### 构建生产版本
```bash
# 前端
cd admin-frontend && npm run build

# 后端
cd backend && npm run build
```

## 🆘 获取帮助

### 遇到问题？
1. 查看 [INSTALL.md](./INSTALL.md) 的常见问题部分
2. 查看 [START_ADMIN.md](./START_ADMIN.md) 的故障排除
3. 查看浏览器控制台和终端日志
4. 查看 API 文档确认接口是否正确

### 想了解更多？
1. 阅读 [ADMIN_SYSTEM_README.md](./ADMIN_SYSTEM_README.md) 了解架构
2. 阅读 [SUMMARY.md](./SUMMARY.md) 了解实现细节
3. 查看源代码注释

## 🎯 快速链接

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [INSTALL.md](./INSTALL.md) | 安装依赖 | 首次使用 |
| [START_ADMIN.md](./START_ADMIN.md) | 启动系统 | 日常使用 |
| [SUMMARY.md](./SUMMARY.md) | 项目概览 | 了解项目 |
| [ADMIN_SYSTEM_README.md](./ADMIN_SYSTEM_README.md) | 系统文档 | 深入学习 |

## 🎉 开始使用

准备好了吗？让我们开始吧！

```bash
# 1. 安装依赖
cd admin-frontend
npm install

# 2. 返回项目根目录
cd ..

# 3. 启动系统
./start-admin.sh

# 4. 打开浏览器访问
# http://localhost:3002
```

祝使用愉快！🚀
