#!/bin/bash

# 后端部署完成后的验证脚本
# 使用方法: bash verify-backend.sh

echo "🔍 验证后端服务..."
echo ""

# 加载 nvm（如果需要）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 2>/dev/null || true

# 检查 PM2 状态
echo "📊 PM2 服务状态:"
pm2 status

echo ""
echo "📝 服务日志（最近 20 行）:"
pm2 logs blog-backend --lines 20 --nostream

echo ""
echo "🧪 测试 API 端点:"
echo "   测试 API 文档..."
if curl -s http://localhost:3001/api-docs > /dev/null; then
    echo "   ✅ API 文档可访问: http://localhost:3001/api-docs"
else
    echo "   ⚠️  API 文档无法访问，请检查日志"
fi

echo ""
echo "   测试文章列表..."
if curl -s http://localhost:3001/articles > /dev/null; then
    echo "   ✅ 文章 API 可访问"
else
    echo "   ⚠️  文章 API 无法访问"
fi

echo ""
echo "🌐 访问地址:"
echo "   本地: http://localhost:3001"
echo "   外网: http://43.139.188.39:3001"
echo "   API 文档: http://43.139.188.39:3001/api-docs"
echo ""
echo "📚 常用命令:"
echo "   查看日志: pm2 logs blog-backend"
echo "   重启服务: pm2 restart blog-backend"
echo "   停止服务: pm2 stop blog-backend"
echo "   查看状态: pm2 status"

