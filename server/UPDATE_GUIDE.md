# 📦 项目更新指南

本文档说明如何更新博客系统的前后端源代码。

---

## 📋 更新流程总览

### 快速更新（推荐）
```bash
# 1. 上传新代码到服务器
./upload-to-server.sh

# 2. 在服务器上执行更新脚本
ssh ubuntu@43.139.188.39
cd /var/www/blog
bash update-project.sh
```

### 手动更新步骤
1. 上传新代码到服务器
2. 重新构建后端
3. 重新构建前端
4. 重启服务

---

## 🔄 快速更新脚本

### 方法一：使用更新脚本（推荐）

创建 `update-project.sh` 脚本：

```bash
#!/bin/bash

# 项目更新脚本
# 使用方法: bash update-project.sh

echo "🔄 开始更新项目..."
echo ""

# 加载 nvm 环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# 1. 更新后端
echo "📦 更新后端..."
cd /var/www/blog/backend

# 重新安装依赖（如果 package.json 有变化）
npm install --registry=https://registry.npmmirror.com

# 重新构建
npm run build

# 重启后端服务
pm2 restart blog-backend

# 2. 更新前端
echo ""
echo "🎨 更新前端..."
cd /var/www/blog/frontend

# 设置环境变量（确保存在）
if [ ! -f ".env.production" ]; then
    echo "NEXT_PUBLIC_API_URL=http://43.139.188.39:3001" > .env.production
fi

# 重新安装依赖
npm install --registry=https://registry.npmmirror.com

# 重新构建
npm run build

# 重启前端服务
pm2 restart blog-frontend

echo ""
echo "✅ 更新完成！"
pm2 status
```

### 方法二：创建便捷更新脚本

在项目根目录创建 `update.sh`：

```bash
#!/bin/bash

# 本地更新脚本：上传并更新服务器
# 使用方法: bash update.sh

echo "🚀 开始更新流程..."
echo ""

# 1. 上传代码到服务器
echo "📤 上传代码到服务器..."
bash upload-to-server.sh

# 2. 在服务器上执行更新
echo ""
echo "🔄 在服务器上执行更新..."
ssh ubuntu@43.139.188.39 "cd /var/www/blog && bash update-project.sh"

echo ""
echo "✅ 更新完成！"
```

---

## 📝 手动更新步骤

### 第一步：上传新代码

#### 方法一：使用更新脚本（推荐）
```bash
cd /Users/zoushenghuang/project/blog/myBlog
bash upload-to-server.sh
```

#### 方法二：手动上传
```bash
# 上传后端代码
scp -r backend ubuntu@43.139.188.39:/var/www/blog/

# 上传前端代码
scp -r frontend ubuntu@43.139.188.39:/var/www/blog/

# 上传其他文件
scp *.sh *.md ubuntu@43.139.188.39:/var/www/blog/
```

### 第二步：连接到服务器

```bash
ssh ubuntu@43.139.188.39
cd /var/www/blog
```

### 第三步：加载 Node.js 环境

```bash
# 每次连接都需要加载
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
```

### 第四步：更新后端

```bash
cd backend

# 检查是否有依赖变化
npm install --registry=https://registry.npmmirror.com

# 重新构建
npm run build

# 重启后端服务
pm2 restart blog-backend

# 检查状态
pm2 logs blog-backend --lines 10
```

### 第五步：更新前端

```bash
cd ../frontend

# 确保环境变量存在
echo "NEXT_PUBLIC_API_URL=http://43.139.188.39:3001" > .env.production

# 重新安装依赖
npm install --registry=https://registry.npmmirror.com

# 重新构建
npm run build

# 重启前端服务
pm2 restart blog-frontend

# 检查状态
pm2 logs blog-frontend --lines 10
```

### 第六步：验证更新

```bash
# 检查所有服务状态
pm2 status

# 测试 API
curl http://localhost:3001/api-docs

# 测试前端
curl http://localhost:3000
```

---

## 🔍 检查更新内容

### 检查后端更新

```bash
# 查看后端日志
pm2 logs blog-backend

# 检查后端进程
ps aux | grep node | grep backend

# 测试 API 端点
curl http://localhost:3001/articles
curl http://localhost:3001/categories
```

### 检查前端更新

```bash
# 查看前端日志
pm2 logs blog-frontend

# 检查前端进程
ps aux | grep next

# 测试页面访问
curl http://localhost:3000
```

---

## 🚨 故障排除

### 问题：构建失败

```bash
# 查看详细错误
npm run build 2>&1

# 清理缓存重试
rm -rf node_modules .next
npm install
npm run build
```

### 问题：服务无法启动

```bash
# 检查端口占用
netstat -tlnp | grep 3001
netstat -tlnp | grep 3000

# 查看错误日志
pm2 logs blog-backend --err
pm2 logs blog-frontend --err

# 重新启动
pm2 restart blog-backend
pm2 restart blog-frontend
```

### 问题：页面显示旧版本

```bash
# 强制刷新浏览器缓存
# 或检查 Nginx 缓存
sudo systemctl restart nginx

# 检查静态文件是否更新
ls -la /var/www/blog-frontend/
```

### 问题：API 调用失败

```bash
# 检查后端服务状态
curl http://localhost:3001/health

# 检查前端环境变量
cat frontend/.env.production

# 重启前端服务
pm2 restart blog-frontend
```

---

## 📊 性能优化

### 更新后的性能检查

```bash
# 检查内存使用
pm2 monit

# 检查响应时间
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000

# 查看系统资源
top -p $(pgrep -f "node\|next")
```

### 清理旧文件

```bash
# 删除旧的构建文件
rm -rf frontend/.next frontend/out
rm -rf backend/dist

# 清理 PM2 日志
pm2 flush

# 清理 npm 缓存
npm cache clean --force
```

---

## 🔧 高级配置

### 零停机更新

```bash
# 使用 PM2 的 reload 实现零停机
pm2 reload blog-backend
pm2 reload blog-frontend
```

### 回滚操作

```bash
# 如果更新失败，可以回滚
pm2 revert blog-backend
pm2 revert blog-frontend
```

### 数据库迁移

如果后端更新涉及数据库变化：

```bash
cd backend
npm run seed  # 如果有数据迁移脚本
```

---

## 📝 更新日志

建议维护更新日志：

```bash
# 创建更新日志
echo "$(date): 更新内容描述" >> update.log

# 查看更新历史
cat update.log
```

---

## 🎯 更新检查清单

- [ ] 备份当前版本
- [ ] 上传新代码
- [ ] 更新后端依赖
- [ ] 重新构建后端
- [ ] 重启后端服务
- [ ] 更新前端依赖
- [ ] 重新构建前端
- [ ] 重启前端服务
- [ ] 测试 API 功能
- [ ] 测试页面显示
- [ ] 检查日志无错误
- [ ] 清理缓存文件

---

## 💡 建议

1. **定期备份**：更新前备份数据库和代码
2. **小步更新**：避免一次性更新太多功能
3. **测试环境**：建议先在测试环境验证
4. **监控告警**：设置服务监控和告警
5. **文档更新**：及时更新 API 文档和部署文档

---

**更新完成后，访问 `http://43.139.188.39` 查看效果！**
