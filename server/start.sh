#!/bin/bash

echo "🚀 启动 Minimal 博客系统"
echo ""

# 检查后端依赖是否已安装
if [ ! -d "backend/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd backend
    npm install
    cd ..
fi

# 启动后端服务
echo "🔧 启动后端服务 (端口 3001)..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 5

# 启动前端服务器
echo "🎨 启动前端服务器 (端口 8080)..."
cd frontend
python3 -m http.server 8080 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 服务已启动！"
echo "📚 前端地址: http://localhost:8080"
echo "📖 API 文档: http://localhost:3001/api-docs"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

