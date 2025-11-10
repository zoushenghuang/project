#!/bin/bash

# 项目更新脚本 - 在服务器上执行
# 使用方法: bash update-project.sh

echo "🔄 开始更新项目..."
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查是否在正确的目录
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录执行此脚本${NC}"
    echo "当前目录: $(pwd)"
    exit 1
fi

# 加载 nvm 环境
echo -e "${GREEN}📦 加载 Node.js 环境...${NC}"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null || {
    echo -e "${YELLOW}⚠️  警告: nvm 加载失败，尝试继续...${NC}"
}

# 验证 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: Node.js 未找到${NC}"
    exit 1
fi

echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 1. 更新后端
echo ""
echo -e "${GREEN}📦 更新后端服务...${NC}"
cd backend

# 备份当前版本（可选）
# mkdir -p ../backup/$(date +%Y%m%d_%H%M%S)
# cp -r . ../backup/$(date +%Y%m%d_%H%M%S)/

# 配置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 重新安装依赖
echo "   安装/更新后端依赖..."
npm install --registry=https://registry.npmmirror.com

# 重新构建
echo "   构建后端项目..."
if npm run build; then
    echo -e "${GREEN}   ✅ 后端构建成功${NC}"
else
    echo -e "${RED}   ❌ 后端构建失败${NC}"
    exit 1
fi

# 重启后端服务
echo "   重启后端服务..."
if pm2 restart blog-backend 2>/dev/null; then
    echo -e "${GREEN}   ✅ 后端服务重启成功${NC}"
else
    echo -e "${YELLOW}   ⚠️  后端服务重启失败，尝试启动...${NC}"
    pm2 start dist/main.js --name blog-backend
fi

cd ..

# 2. 更新前端
echo ""
echo -e "${GREEN}🎨 更新前端服务...${NC}"
cd frontend

# 确保环境变量存在
if [ ! -f ".env.production" ]; then
    echo "NEXT_PUBLIC_API_URL=http://43.139.188.39:3001" > .env.production
    echo "   创建了环境变量文件"
fi

# 配置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 重新安装依赖
echo "   安装/更新前端依赖..."
npm install --registry=https://registry.npmmirror.com

# 清理旧的构建文件
echo "   清理旧的构建文件..."
rm -rf .next out

# 重新构建
echo "   构建前端项目..."
if npm run build; then
    echo -e "${GREEN}   ✅ 前端构建成功${NC}"
else
    echo -e "${RED}   ❌ 前端构建失败${NC}"
    exit 1
fi

# 重启前端服务
echo "   重启前端服务..."
if pm2 restart blog-frontend 2>/dev/null; then
    echo -e "${GREEN}   ✅ 前端服务重启成功${NC}"
else
    echo -e "${YELLOW}   ⚠️  前端服务重启失败，尝试启动...${NC}"
    # 重新创建 PM2 配置
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
    pm2 start ecosystem.config.js
fi

cd ..

# 保存 PM2 配置
pm2 save

# 3. 验证更新
echo ""
echo -e "${GREEN}🔍 验证更新结果...${NC}"

# 检查服务状态
echo "服务状态:"
pm2 status

# 测试后端 API
echo ""
echo "测试后端 API:"
if curl -s http://localhost:3001/api-docs > /dev/null; then
    echo -e "${GREEN}   ✅ 后端 API 可访问${NC}"
else
    echo -e "${YELLOW}   ⚠️  后端 API 无法访问${NC}"
fi

# 测试前端
echo ""
echo "测试前端服务:"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}   ✅ 前端服务可访问${NC}"
else
    echo -e "${YELLOW}   ⚠️  前端服务无法访问${NC}"
fi

# 显示访问地址
echo ""
echo "=================================="
echo -e "${GREEN}✅ 项目更新完成！${NC}"
echo ""
echo "🌐 访问地址:"
echo "   博客首页: http://43.139.188.39"
echo "   API 文档: http://43.139.188.39/api-docs"
echo ""
echo "📊 服务状态:"
pm2 status
echo ""
echo "📝 常用命令:"
echo "   查看日志: pm2 logs blog-backend"
echo "   查看日志: pm2 logs blog-frontend"
echo "   重启服务: pm2 restart blog-backend"
echo "   重启服务: pm2 restart blog-frontend"
echo ""
echo "🆘 如果有问题:"
echo "   1. 检查日志: pm2 logs"
echo "   2. 重启服务: pm2 restart all"
echo "   3. 检查 Nginx: sudo systemctl status nginx"
