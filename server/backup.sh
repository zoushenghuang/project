#!/bin/bash

# 博客系统备份脚本
# 使用方法: ./backup.sh
# 建议添加到 crontab: 0 2 * * * /var/www/blog/backup.sh >> /var/log/blog-backup.log 2>&1

set -e

# 配置
BACKUP_DIR="/var/backups/blog"
PROJECT_DIR="/var/www/blog"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

echo "📦 开始备份博客系统..."
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 创建备份目录
mkdir -p $BACKUP_DIR

# 1. 备份数据库
echo "💾 备份数据库..."
if [ -f "$PROJECT_DIR/backend/blog.db" ]; then
    cp "$PROJECT_DIR/backend/blog.db" "$BACKUP_DIR/blog_$DATE.db"
    echo "   ✅ 数据库备份完成: blog_$DATE.db"
else
    echo "   ⚠️  警告: 数据库文件不存在"
fi

# 2. 备份代码（可选，如果代码有重要修改）
echo ""
echo "📁 备份代码..."
tar -czf "$BACKUP_DIR/code_$DATE.tar.gz" \
    -C "$PROJECT_DIR" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.next' \
    --exclude='out' \
    --exclude='*.log' \
    backend frontend 2>/dev/null || true

if [ -f "$BACKUP_DIR/code_$DATE.tar.gz" ]; then
    echo "   ✅ 代码备份完成: code_$DATE.tar.gz"
else
    echo "   ⚠️  代码备份失败或跳过"
fi

# 3. 备份 Nginx 配置（如果存在）
echo ""
echo "🌐 备份 Nginx 配置..."
if [ -f "/etc/nginx/sites-available/blog" ]; then
    sudo cp /etc/nginx/sites-available/blog "$BACKUP_DIR/nginx_blog_$DATE.conf" 2>/dev/null || true
    echo "   ✅ Nginx 配置备份完成"
fi

# 4. 备份 PM2 配置
echo ""
echo "⚙️  备份 PM2 配置..."
if [ -f "$PROJECT_DIR/ecosystem.config.js" ]; then
    cp "$PROJECT_DIR/ecosystem.config.js" "$BACKUP_DIR/ecosystem_$DATE.config.js"
    echo "   ✅ PM2 配置备份完成"
fi

# 5. 清理旧备份
echo ""
echo "🧹 清理 $RETENTION_DAYS 天前的备份..."
find $BACKUP_DIR -name "*.db" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.conf" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.config.js" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
echo "   ✅ 清理完成"

# 6. 显示备份信息
echo ""
echo "📊 备份统计:"
echo "   备份目录: $BACKUP_DIR"
echo "   数据库备份: $(ls -1 $BACKUP_DIR/*.db 2>/dev/null | wc -l) 个文件"
echo "   代码备份: $(ls -1 $BACKUP_DIR/*.tar.gz 2>/dev/null | wc -l) 个文件"
echo "   总大小: $(du -sh $BACKUP_DIR | cut -f1)"

echo ""
echo "✅ 备份完成！"
echo ""

