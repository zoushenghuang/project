-- 删除 articles 表中的 authorId 字段（如果存在）
-- 注意：SQLite 不支持直接删除列，需要重建表

-- 1. 创建新表（不包含 authorId）
CREATE TABLE articles_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  coverImage TEXT,
  isFeatured INTEGER DEFAULT 0,
  viewCount INTEGER DEFAULT 0,
  commentCount INTEGER DEFAULT 0,
  categoryId INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);

-- 2. 复制数据（排除 authorId）
INSERT INTO articles_new (id, title, summary, content, coverImage, isFeatured, viewCount, commentCount, categoryId, createdAt, updatedAt)
SELECT id, title, summary, content, coverImage, isFeatured, viewCount, commentCount, categoryId, createdAt, updatedAt
FROM articles;

-- 3. 删除旧表
DROP TABLE articles;

-- 4. 重命名新表
ALTER TABLE articles_new RENAME TO articles;

-- 5. 删除 authors 表（如果存在）
DROP TABLE IF EXISTS authors;

-- 6. 删除 article_tags 表中的 authorId 相关索引（如果有）
-- SQLite 会自动处理，无需手动删除

