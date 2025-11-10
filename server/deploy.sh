#!/bin/bash

# 博客系统部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署博客系统..."
echo ""

# 检查是否在正确的目录
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 1. 部署后端
echo "📦 步骤 1/4: 部署后端服务..."
cd backend

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "   安装后端依赖..."
    npm install --production
else
    echo "   更新后端依赖..."
    npm install --production
fi

# 构建项目
echo "   构建后端项目..."
npm run build

# 创建日志目录
mkdir -p logs

# 启动或重启服务
if pm2 list | grep -q "blog-backend"; then
    echo "   重启后端服务..."
    pm2 restart blog-backend
else
    echo "   启动后端服务..."
    pm2 start dist/main.js --name blog-backend
fi

cd ..

# 2. 部署前端（静态导出）
echo ""
echo "🎨 步骤 2/4: 部署前端服务..."

cd frontend

# 检查环境变量文件
if [ ! -f ".env.production" ]; then
    echo "   ⚠️  警告: .env.production 文件不存在"
    echo "   请创建 .env.production 文件并设置 NEXT_PUBLIC_API_URL"
    read -p "   是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "   安装前端依赖..."
    npm install
else
    echo "   更新前端依赖..."
    npm install
fi

# 构建项目
echo "   构建前端项目..."
npm run build

# 检查构建输出目录
if [ ! -d "out" ]; then
    echo "   ⚠️  警告: out 目录不存在，请检查 next.config.js 是否配置了 output: 'export'"
    read -p "   是否继续? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

cd ..

# 3. 复制前端文件到 Nginx 目录
echo ""
echo "📁 步骤 3/4: 复制前端文件..."

NGINX_DIR="/var/www/blog-frontend"

# 检查是否有 sudo 权限
if sudo -n true 2>/dev/null; then
    sudo mkdir -p $NGINX_DIR
    sudo cp -r frontend/out/* $NGINX_DIR/
    sudo chown -R www-data:www-data $NGINX_DIR
    echo "   ✅ 文件已复制到 $NGINX_DIR"
else
    echo "   ⚠️  需要 sudo 权限来复制文件到 Nginx 目录"
    echo "   请手动执行以下命令:"
    echo "   sudo mkdir -p $NGINX_DIR"
    echo "   sudo cp -r frontend/out/* $NGINX_DIR/"
    echo "   sudo chown -R www-data:www-data $NGINX_DIR"
fi

# 4. 重启 Nginx
echo ""
echo "🌐 步骤 4/4: 重启 Nginx..."

if sudo -n true 2>/dev/null; then
    if sudo nginx -t; then
        sudo systemctl restart nginx
        echo "   ✅ Nginx 已重启"
    else
        echo "   ❌ Nginx 配置有误，请检查配置文件"
        exit 1
    fi
else
    echo "   ⚠️  需要 sudo 权限来重启 Nginx"
    echo "   请手动执行: sudo systemctl restart nginx"
fi

# 5. 显示状态
echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 服务状态:"
pm2 status

echo ""
echo "🔍 检查服务:"
echo "   后端 API: http://localhost:3001/api-docs"
echo "   前端页面: http://localhost (或你的域名)"
echo ""
echo "📝 常用命令:"
echo "   查看日志: pm2 logs blog-backend"
echo "   重启服务: pm2 restart blog-backend"
echo "   查看状态: pm2 status"

