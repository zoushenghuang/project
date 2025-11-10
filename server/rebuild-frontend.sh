#!/bin/bash

# 快速修复并重新构建前端
# 在服务器上执行: bash rebuild-frontend.sh

echo "🔧 修复并重新构建前端..."
echo ""

# 加载 nvm 环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd /var/www/blog/frontend

# 确保环境变量存在
if [ ! -f ".env.production" ]; then
    echo "NEXT_PUBLIC_API_URL=http://43.139.188.39:3001" > .env.production
fi

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf .next out node_modules/.cache

# 重新构建
echo "🔨 重新构建前端..."
npm run build

# 检查构建结果
if [ -d "out" ]; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "📁 复制文件到 Nginx 目录..."
    sudo rm -rf /var/www/blog-frontend/*
    sudo cp -r out/* /var/www/blog-frontend/
    sudo chown -R www-data:www-data /var/www/blog-frontend
    sudo chmod -R 755 /var/www/blog-frontend
    echo "✅ 前端文件已部署！"
else
    echo "❌ 构建失败，out 目录不存在"
    exit 1
fi

echo ""
echo "🎉 前端部署完成！"
echo "访问地址: http://43.139.188.39"

