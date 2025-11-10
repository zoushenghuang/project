#!/bin/bash

# 前端部署脚本
# 使用方法: 在服务器上执行 bash deploy-frontend.sh

set -e

echo "🎨 开始部署前端..."
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查项目文件
if [ ! -d "/var/www/blog/frontend" ]; then
    echo -e "${YELLOW}⚠️  前端项目文件不存在${NC}"
    echo "请先上传前端项目文件到 /var/www/blog/frontend"
    exit 1
fi

cd /var/www/blog/frontend

# 1. 检查环境变量
echo -e "${GREEN}📝 步骤 1/4: 检查环境变量...${NC}"
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}   ⚠️  .env.production 文件不存在，正在创建...${NC}"
    cat > .env.production << EOF
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://43.139.188.39:3001
EOF
    echo "   已创建 .env.production 文件"
    echo "   请检查并修改 NEXT_PUBLIC_API_URL 配置"
else
    echo "   .env.production 文件已存在"
fi

# 2. 配置 npm 镜像并安装依赖
echo ""
echo -e "${GREEN}📦 步骤 2/4: 配置 npm 镜像并安装前端依赖...${NC}"

# 确保使用淘宝镜像
npm config set registry https://registry.npmmirror.com

if [ ! -d "node_modules" ]; then
    echo "   安装前端依赖 (使用淘宝镜像)..."
    npm install --registry=https://registry.npmmirror.com
else
    echo "   更新前端依赖 (使用淘宝镜像)..."
    npm install --registry=https://registry.npmmirror.com
fi

# 3. 构建项目
echo ""
echo -e "${GREEN}🔨 步骤 3/4: 构建前端项目...${NC}"
export NODE_ENV=production
npm run build

# 检查构建输出（SSR 模式使用 .next 目录）
if [ ! -d ".next" ]; then
    echo -e "${RED}   ❌ 构建失败，.next 目录不存在${NC}"
    exit 1
fi

# 4. 使用 PM2 启动前端服务（SSR 模式）
echo ""
echo -e "${GREEN}🚀 步骤 4/4: 启动前端服务（SSR 模式）...${NC}"

# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'blog-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/blog/frontend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_URL: 'http://43.139.188.39:3001'
    },
    error_file: './logs/frontend-err.log',
    out_file: './logs/frontend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '800M'
  }]
}
EOF

# 启动或重启服务
if pm2 list | grep -q "blog-frontend"; then
    echo "   重启前端服务..."
    pm2 restart blog-frontend
else
    echo "   启动前端服务..."
    pm2 start ecosystem.config.js
fi

pm2 save

