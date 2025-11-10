#!/bin/bash

# 博客系统自动化部署脚本
# 使用方法: 在服务器上执行 bash deploy-server.sh

set -e

echo "🚀 开始部署博客系统..."
echo "=================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为 root 或 sudo 用户
if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
    echo -e "${YELLOW}⚠️  需要 sudo 权限，部分操作需要输入密码${NC}"
fi

# 1. 更新系统
echo -e "${GREEN}📦 步骤 1/8: 更新系统包...${NC}"
sudo apt update
sudo apt upgrade -y

# 2. 安装基础工具
echo ""
echo -e "${GREEN}📦 步骤 2/8: 安装基础工具...${NC}"
sudo apt install -y curl wget git build-essential python3

# 3. 安装 Node.js (使用 nvm + 国内镜像)
echo ""
echo -e "${GREEN}📦 步骤 3/8: 安装 Node.js (使用国内镜像加速)...${NC}"
if ! command -v node &> /dev/null; then
    echo "   安装 nvm (使用国内镜像)..."
    # 使用 gitee 镜像安装 nvm
    export NVM_SOURCE=https://gitee.com/mirrors/nvm.git
    curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
    
    # 如果 gitee 镜像失败，使用备用方法
    if [ ! -d "$HOME/.nvm" ]; then
        echo "   使用备用方法安装 nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash || {
            # 如果还是失败，使用国内 CDN
            echo "   使用国内 CDN 安装 nvm..."
            curl -o- https://cdn.jsdelivr.net/gh/nvm-sh/nvm@v0.39.0/install.sh | bash
        }
    fi
    
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # 配置 nvm 使用淘宝镜像
    echo "   配置 Node.js 下载镜像为淘宝镜像..."
    export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/
    
    echo "   安装 Node.js 20 (使用淘宝镜像)..."
    NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/ nvm install 20
    nvm use 20
    nvm alias default 20
    
    # 添加到 .bashrc
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
    echo 'export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/' >> ~/.bashrc
else
    echo "   Node.js 已安装: $(node -v)"
fi

# 重新加载环境变量
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/

# 配置 npm 使用淘宝镜像
echo "   配置 npm 使用淘宝镜像..."
npm config set registry https://registry.npmmirror.com

# 配置其他镜像（可选，根据需要）
npm config set electron_mirror https://npmmirror.com/mirrors/electron/ 2>/dev/null || true
npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass/ 2>/dev/null || true
npm config set puppeteer_download_host https://npmmirror.com/mirrors 2>/dev/null || true
npm config set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver 2>/dev/null || true
npm config set operadriver_cdnurl https://npmmirror.com/mirrors/operadriver 2>/dev/null || true
npm config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs 2>/dev/null || true
npm config set selenium_cdnurl https://npmmirror.com/mirrors/selenium 2>/dev/null || true
npm config set node_inspector_cdnurl https://npmmirror.com/mirrors/node-inspector 2>/dev/null || true

echo "   ✅ npm 镜像配置完成"

# 4. 安装 PM2
echo ""
echo -e "${GREEN}📦 步骤 4/8: 安装 PM2 (使用淘宝镜像)...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 --registry=https://registry.npmmirror.com
    
    # 设置 PM2 开机自启
    echo "   配置 PM2 开机自启..."
    # 获取 Node.js 和 PM2 的路径
    NODE_PATH=$(which node)
    PM2_PATH=$(which pm2)
    NODE_DIR=$(dirname $(dirname $NODE_PATH))
    
    # 执行 PM2 startup（自动检测系统）
    sudo env PATH=$PATH:$NODE_DIR/bin $PM2_PATH startup systemd -u $USER --hp $HOME 2>/dev/null || {
        echo -e "${YELLOW}   ⚠️  自动配置启动脚本失败，请手动执行以下命令:${NC}"
        echo "   sudo env PATH=\$PATH:$NODE_DIR/bin $PM2_PATH startup systemd -u $USER --hp $HOME"
    }
else
    echo "   PM2 已安装: $(pm2 -v)"
fi

# 5. 安装 Nginx
echo ""
echo -e "${GREEN}📦 步骤 5/8: 安装 Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo "   Nginx 已安装"
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

# 6. 创建项目目录
echo ""
echo -e "${GREEN}📦 步骤 6/8: 创建项目目录...${NC}"
sudo mkdir -p /var/www/blog
sudo mkdir -p /var/www/blog-frontend
sudo chown -R $USER:$USER /var/www/blog
sudo chown -R $USER:$USER /var/www/blog-frontend

# 7. 检查项目文件
echo ""
echo -e "${GREEN}📦 步骤 7/8: 检查项目文件...${NC}"
if [ ! -d "/var/www/blog/backend" ]; then
    echo -e "${YELLOW}   ⚠️  项目文件不存在，请先上传项目文件${NC}"
    echo "   可以使用以下命令从本地 Mac 上传:"
    echo "   scp -r /Users/zoushenghuang/project/blog/myBlog/* ubuntu@43.139.188.39:/var/www/blog/"
    echo ""
    read -p "   是否已上传项目文件? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}   请先上传项目文件后再运行此脚本${NC}"
        exit 1
    fi
fi

# 8. 部署后端
echo ""
echo -e "${GREEN}📦 步骤 8/8: 部署后端服务...${NC}"
cd /var/www/blog/backend

# 安装所有依赖（包括 devDependencies，构建需要）
if [ ! -d "node_modules" ]; then
    echo "   安装后端依赖 (使用淘宝镜像，包含构建工具)..."
    npm install --registry=https://registry.npmmirror.com
else
    echo "   更新后端依赖 (使用淘宝镜像，包含构建工具)..."
    npm install --registry=https://registry.npmmirror.com
fi

# 构建项目
echo "   构建后端项目..."
npm run build

# 安装生产依赖（可选：删除 devDependencies 以节省空间）
echo "   安装生产依赖..."
npm install --production --registry=https://registry.npmmirror.com

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

# 保存 PM2 配置
pm2 save

# 检查服务状态
echo ""
echo -e "${GREEN}✅ 后端部署完成！${NC}"
echo ""
pm2 status

# 测试后端 API
echo ""
echo "🔍 测试后端服务..."
sleep 2
if curl -s http://localhost:3001/api-docs > /dev/null; then
    echo -e "${GREEN}   ✅ 后端服务运行正常${NC}"
else
    echo -e "${YELLOW}   ⚠️  后端服务可能未正常启动，请检查日志: pm2 logs blog-backend${NC}"
fi

echo ""
echo "=================================="
echo -e "${GREEN}🎉 后端部署完成！${NC}"
echo ""
echo "📝 下一步操作:"
echo "   1. 上传前端项目文件"
echo "   2. 配置前端环境变量 (.env.production)"
echo "   3. 构建前端项目"
echo "   4. 配置 Nginx"
echo ""
echo "📚 常用命令:"
echo "   查看日志: pm2 logs blog-backend"
echo "   重启服务: pm2 restart blog-backend"
echo "   查看状态: pm2 status"
echo "   测试 API: curl http://localhost:3001/api-docs"

