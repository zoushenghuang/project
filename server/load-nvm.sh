#!/bin/bash

# 加载 nvm 环境并执行命令
# 使用方法: source load-nvm.sh 或 . load-nvm.sh

# 加载 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 设置 Node.js 镜像
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/

# 使用 Node.js 20
nvm use 20

echo "✅ nvm 环境已加载"
echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

