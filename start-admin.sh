#!/bin/bash

echo "🚀 启动博客后台管理系统..."
echo ""

# 检查是否在正确的目录
if [ ! -d "backend" ] || [ ! -d "admin-frontend" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查 node_modules
if [ ! -d "admin-frontend/node_modules" ]; then
    echo "📦 检测到前端依赖未安装，正在安装..."
    cd admin-frontend
    npm install
    cd ..
    echo "✅ 前端依赖安装完成"
    echo ""
fi

# 启动后端
echo "🔧 启动后端 API (端口 3001)..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 5

# 启动前端
echo "🎨 启动前端管理系统 (端口 3002)..."
cd admin-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 系统启动成功！"
echo ""
echo "📍 访问地址："
echo "   - 后台管理系统: http://localhost:3002"
echo "   - API 文档:      http://localhost:3001/api"
echo ""
echo "💡 提示："
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - 查看日志请查看各自的终端输出"
echo ""

# 等待用户中断
wait
