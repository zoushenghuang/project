# 博客后台管理系统 - 安装指南

## 📋 系统要求

- Node.js >= 16.0.0
- npm >= 8.0.0

检查版本：
```bash
node --version
npm --version
```

## 🚀 快速安装

### 1. 安装前端依赖

```bash
cd admin-frontend
npm install
```

如果遇到依赖冲突，使用：
```bash
npm install --legacy-peer-deps
```

### 2. 验证后端依赖

后端依赖应该已经安装，如果没有：
```bash
cd backend
npm install
```

## ✅ 验证安装

### 1. 检查前端依赖
```bash
cd admin-frontend
ls node_modules | wc -l
```
应该显示大量依赖包（通常 > 100）

### 2. 检查后端依赖
```bash
cd backend
ls node_modules | wc -l
```
应该显示大量依赖包

## 🎯 启动系统

### 方式一：使用启动脚本（推荐）
```bash
cd /Users/zoushenghuang/project/blog/git-blog
./start-admin.sh
```

### 方式二：手动启动

**终端 1 - 启动后端**
```bash
cd backend
npm run start:dev
```
等待看到：
```
[Nest] Application successfully started
```

**终端 2 - 启动前端**
```bash
cd admin-frontend
npm run dev
```
等待看到：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3002/
```

## 🌐 访问系统

打开浏览器访问：

- **后台管理系统**: http://localhost:3002
- **API 文档**: http://localhost:3001/api

## 🔍 测试功能

### 1. 测试 Dashboard
1. 访问 http://localhost:3002
2. 应该自动跳转到 `/dashboard`
3. 查看统计卡片和图表

### 2. 测试文章管理
1. 点击左侧菜单 "文章管理"
2. 查看文章列表
3. 点击 "新建文章" 创建测试文章
4. 填写表单并发布

### 3. 测试草稿管理
1. 点击左侧菜单 "草稿管理"
2. 点击 "新建草稿"
3. 填写表单并保存
4. 尝试发布草稿

## ❗ 常见问题

### Q1: npm install 失败
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install --legacy-peer-deps
```

### Q2: 端口被占用
```bash
# 查看端口占用
lsof -i :3001  # 后端
lsof -i :3002  # 前端

# 杀死进程
kill -9 <PID>
```

### Q3: 数据库错误
```bash
# 检查数据库文件
ls -lh backend/blog.db

# 如果没有，运行种子数据
cd backend
npm run seed
```

### Q4: TypeScript 错误
这些错误在安装依赖后会自动解决。如果仍有问题：
```bash
cd admin-frontend
npx tsc --noEmit
```

### Q5: 前端空白页面
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页的错误
3. 查看 Network 标签页的请求
4. 确保后端 API 正常运行

## 📦 依赖说明

### 前端主要依赖
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.1
- antd: ^5.12.5
- axios: ^1.6.2
- recharts: ^2.10.3
- tailwindcss: ^3.3.6
- vite: ^5.0.8

### 后端主要依赖
- @nestjs/core: ^10.3.0
- @nestjs/typeorm: ^10.0.1
- typeorm: ^0.3.17
- better-sqlite3: ^11.0.0
- @nestjs/swagger: ^7.1.17

## 🎓 下一步

安装完成后，建议：

1. 阅读 [START_ADMIN.md](./START_ADMIN.md) 了解功能
2. 阅读 [ADMIN_SYSTEM_README.md](./ADMIN_SYSTEM_README.md) 了解架构
3. 查看 API 文档: http://localhost:3001/api
4. 开始使用系统！

## 💡 开发提示

### 开发模式
- 后端使用 `--watch` 模式，代码改动自动重启
- 前端使用 Vite HMR，代码改动自动刷新

### 生产构建
```bash
# 前端
cd admin-frontend
npm run build

# 后端
cd backend
npm run build
```

### 代码检查
```bash
# 前端
cd admin-frontend
npm run lint

# 后端
cd backend
npm run lint
```

## 🎉 安装完成

恭喜！你已经成功安装了博客后台管理系统。

如有问题，请查看：
- [常见问题](#-常见问题)
- [系统文档](./ADMIN_SYSTEM_README.md)
- [启动指南](./START_ADMIN.md)

祝使用愉快！🚀
