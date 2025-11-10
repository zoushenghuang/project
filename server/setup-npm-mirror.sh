#!/bin/bash

# 快速配置 npm 使用国内镜像
# 使用方法: bash setup-npm-mirror.sh

echo "🔧 配置 npm 使用淘宝镜像..."
echo ""

# 配置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 配置其他镜像（可选）
npm config set electron_mirror https://npmmirror.com/mirrors/electron/ 2>/dev/null || true
npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass/ 2>/dev/null || true
npm config set puppeteer_download_host https://npmmirror.com/mirrors 2>/dev/null || true
npm config set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver 2>/dev/null || true
npm config set operadriver_cdnurl https://npmmirror.com/mirrors/operadriver 2>/dev/null || true
npm config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs 2>/dev/null || true
npm config set selenium_cdnurl https://npmmirror.com/mirrors/selenium 2>/dev/null || true
npm config set node_inspector_cdnurl https://npmmirror.com/mirrors/node-inspector 2>/dev/null || true

echo "✅ npm 镜像配置完成！"
echo ""
echo "📝 当前配置:"
npm config get registry
echo ""
echo "🧪 测试连接:"
npm ping

