#!/bin/bash

# Nginx 配置脚本
# 使用方法: 在服务器上执行 bash configure-nginx.sh

set -e

echo "🌐 配置 Nginx..."
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVER_IP="43.139.188.39"
NGINX_CONFIG="/etc/nginx/sites-available/blog"

# 创建 Nginx 配置
echo -e "${GREEN}📝 创建 Nginx 配置文件...${NC}"
sudo tee $NGINX_CONFIG > /dev/null << 'EOF'
# 前端静态文件服务
server {
    listen 80;
    server_name _;  # 默认服务器，可以替换为域名

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # 前端 SSR 代理（Next.js SSR 模式）
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存（Next.js 自动处理）
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # API 代理到后端
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 直接代理后端 API
    location ~ ^/(articles|categories|tags|subscriptions|api-docs) {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 启用站点
echo -e "${GREEN}🔗 启用站点配置...${NC}"
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/blog

# 删除默认配置（可选）
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    echo -e "${YELLOW}   删除默认 Nginx 配置...${NC}"
    sudo rm /etc/nginx/sites-enabled/default
fi

# 测试配置
echo ""
echo -e "${GREEN}🧪 测试 Nginx 配置...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}   ✅ 配置正确${NC}"
else
    echo -e "${RED}   ❌ 配置有误，请检查${NC}"
    exit 1
fi

# 重启 Nginx
echo ""
echo -e "${GREEN}🔄 重启 Nginx...${NC}"
sudo systemctl restart nginx

# 检查状态
echo ""
echo -e "${GREEN}📊 检查服务状态...${NC}"
sudo systemctl status nginx --no-pager | head -5

# 配置防火墙
echo ""
echo -e "${GREEN}🔥 配置防火墙...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 3001/tcp
    echo "   防火墙规则已添加"
else
    echo "   ufw 未安装，跳过防火墙配置"
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ Nginx 配置完成！${NC}"
echo ""
echo "🌐 访问地址:"
echo "   前端: http://$SERVER_IP"
echo "   API: http://$SERVER_IP/api-docs"
echo ""
echo "📝 如果使用域名，请修改配置文件中的 server_name:"
echo "   sudo nano $NGINX_CONFIG"

