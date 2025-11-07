# 博客前端

基于 Next.js 15 + React 18 + TypeScript + Tailwind CSS + antd 的现代化博客前端。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI 库**: React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: antd 5
- **状态管理**: Zustand
- **Markdown 渲染**: react-markdown + highlight.js
- **HTTP 客户端**: axios

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并修改 API 地址：

```bash
cp .env.local.example .env.local
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── articles/          # 文章相关页面
│   │   └── [id]/         # 文章详情页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ReadingProgress.tsx
│   ├── articles/         # 文章组件
│   │   └── ArticleCard.tsx
│   ├── sidebar/          # 侧边栏组件
│   │   ├── AuthorCard.tsx
│   │   ├── CategoriesList.tsx
│   │   ├── PopularArticles.tsx
│   │   ├── TagsCloud.tsx
│   │   └── SubscriptionForm.tsx
│   ├── pages/           # 页面组件
│   │   └── HomePage.tsx
│   ├── MarkdownRenderer.tsx
│   └── MarkdownEditor.tsx
├── lib/                  # 工具库
│   ├── api.ts           # API 客户端
│   └── utils.ts         # 工具函数
├── store/               # 状态管理
│   └── useBlogStore.ts  # Zustand store
└── package.json
```

## 功能特性

- ✅ 响应式设计
- ✅ 文章列表和详情
- ✅ Markdown 渲染和代码高亮
- ✅ Markdown 编辑器（编辑/预览模式）
- ✅ 分类筛选
- ✅ 文章搜索
- ✅ 热门文章
- ✅ 标签云
- ✅ 作者信息
- ✅ 邮件订阅
- ✅ 阅读进度条
- ✅ 组件化架构

## 组件说明

### MarkdownRenderer

Markdown 内容渲染组件，支持代码高亮、GFM 语法等。

```tsx
<MarkdownRenderer content={markdownContent} />
```

### MarkdownEditor

Markdown 编辑器组件，支持编辑和预览模式。

```tsx
<MarkdownEditor
  value={content}
  onChange={(value) => setContent(value)}
  showPreview={true}
/>
```

## API 集成

所有 API 调用都在 `lib/api.ts` 中定义，使用 axios 进行 HTTP 请求。

## 状态管理

使用 Zustand 进行状态管理，store 定义在 `store/useBlogStore.ts`。

## 样式

- 使用 Tailwind CSS 进行样式设计
- antd 组件样式已集成
- 自定义 Markdown 样式在 `globals.css` 中定义

## 注意事项

1. 确保后端 API 服务已启动（默认端口 3001）
2. 配置正确的 `NEXT_PUBLIC_API_URL` 环境变量
3. 图片域名需要在 `next.config.js` 中配置
