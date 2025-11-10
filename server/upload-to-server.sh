#!/bin/bash

# 上传整个项目到服务器（排除依赖包）
# 使用方法: bash upload-to-server.sh

echo "📤 开始上传整个项目到服务器..."
echo ""

SERVER="ubuntu@43.139.188.39"
REMOTE_DIR="/var/www/blog"

# 检查本地项目目录
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本"
    echo "当前目录: $(pwd)"
    exit 1
fi

echo "📁 本地项目目录: $(pwd)"
echo "📁 服务器目录: $REMOTE_DIR"
echo ""

# 先创建服务器目录
echo "🔧 在服务器上创建目录..."
ssh $SERVER "sudo mkdir -p $REMOTE_DIR && sudo chown -R ubuntu:ubuntu $REMOTE_DIR"

# 上传文件（排除依赖包和构建产物）
echo ""
echo "📤 上传项目文件..."
echo "   排除: node_modules, .git, dist, .next, out, *.log, .DS_Store"
echo ""

rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.next' \
  --exclude 'out' \
  --exclude '*.log' \
  --exclude '.DS_Store' \
  --exclude 'coverage' \
  --exclude 'logs' \
  ./ \
  $SERVER:$REMOTE_DIR/

echo ""
echo "✅ 完整项目上传完成！"
echo ""
echo "📝 在服务器上执行:"
echo "   ssh $SERVER"
echo "   cd $REMOTE_DIR"
echo "   chmod +x *.sh"
echo "   bash deploy-server.sh"

