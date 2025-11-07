'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/lib/api'
import { formatViewCount } from '@/lib/utils'

interface PopularArticlesProps {
  articles: Article[]
}

export default function PopularArticles({ articles }: PopularArticlesProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm fade-in">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <i className="fas fa-fire text-orange-500 mr-2"></i>
        热门文章
      </h3>
      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="flex group"
            >
              <img
                src={article.coverImage || 'https://via.placeholder.com/80'}
                alt={article.title}
                className="w-20 h-20 object-cover rounded-lg mr-3 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-500 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  <i className="far fa-eye mr-1"></i>
                  {formatViewCount(article.viewCount)} 阅读
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-slate-500 text-sm text-center py-4">暂无热门文章</div>
        )}
      </div>
    </div>
  )
}

