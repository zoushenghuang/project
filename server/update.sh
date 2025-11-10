#!/bin/bash

# 本地更新脚本：上传代码并在服务器上更新
# 使用方法: bash update.sh

echo "🚀 开始项目更新流程..."
echo "=================================="
echo ""

SERVER="ubuntu@43.139.188.39"

# 1. 检查本地代码
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本"
    echo "当前目录: $(pwd)"
    exit 1
fi

# 2. 上传代码到服务器
echo "📤 上传代码到服务器..."
echo "   排除: node_modules, .git, dist, .next, out, *.log"
echo ""

if rsync -avz --progress \
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
  $SERVER:/var/www/blog/; then
    echo ""
    echo "✅ 代码上传完成！"
else
    echo ""
    echo "❌ 代码上传失败！"
    exit 1
fi

# 3. 在服务器上执行更新
echo ""
echo "🔄 在服务器上执行更新..."

if ssh $SERVER "cd /var/www/blog && chmod +x update-project.sh && bash update-project.sh"; then
    echo ""
    echo "✅ 项目更新完成！"
    echo ""
    echo "🌐 访问地址:"
    echo "   博客首页: http://43.139.188.39"
    echo "   API 文档: http://43.139.188.39/api-docs"
else
    echo ""
    echo "❌ 服务器更新失败！"
    echo ""
    echo "请手动在服务器上执行:"
    echo "   ssh $SERVER"
    echo "   cd /var/www/blog"
    echo "   bash update-project.sh"
    exit 1
fi

echo ""
echo "=================================="
echo "🎉 更新流程完成！"
