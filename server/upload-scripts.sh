#!/bin/bash

# 上传部署脚本到服务器
# 使用方法: bash upload-scripts.sh

echo "📤 上传部署脚本到服务器..."
echo ""

SERVER="ubuntu@43.139.188.39"
REMOTE_DIR="/var/www/blog"

# 上传所有脚本文件
echo "📁 上传脚本文件..."
scp deploy-server.sh deploy-frontend.sh configure-nginx.sh setup-npm-mirror.sh upload-to-server.sh \
    $SERVER:$REMOTE_DIR/

echo ""
echo "✅ 脚本上传完成！"
echo ""
echo "📝 在服务器上执行:"
echo "   ssh $SERVER"
echo "   cd $REMOTE_DIR"
echo "   chmod +x *.sh"
echo "   bash deploy-server.sh"

