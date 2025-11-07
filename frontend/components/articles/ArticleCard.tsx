'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/lib/api'
import { formatDate, formatViewCount, getCategoryColor } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <div className="mb-12 fade-in">
        <div className="article-card bg-white rounded-2xl overflow-hidden shadow-md">
          <div className="relative h-64 md:h-80">
            <Image
              src={article.coverImage || 'https://via.placeholder.com/800x400'}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white w-full">
                <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full mb-3">
                  特色文章
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{article.title}</h2>
                <p className="text-white/80 mb-4 line-clamp-2">{article.summary}</p>
                <div className="flex items-center text-sm">
                  <span>
                    {formatDate(article.createdAt)}
                  </span>
                  <span className="mx-3">•</span>
                  <span>
                    <i className="far fa-eye mr-1"></i>
                    {formatViewCount(article.viewCount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="article-card bg-white rounded-xl overflow-hidden shadow-sm fade-in">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <Image
            src={article.coverImage || 'https://via.placeholder.com/400x300'}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6 md:w-2/3">
          <div className="flex items-center mb-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.category?.name)}`}>
              {article.category?.name || '未分类'}
            </span>
            <span className="ml-auto text-xs text-slate-500">
              {formatDate(article.createdAt)}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800 hover:text-blue-500 transition-colors">
            <Link href={`/articles/${article.id}`}>{article.title}</Link>
          </h3>
          <p className="text-slate-600 mb-4 line-clamp-2">{article.summary}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-slate-500">
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              <span className="flex items-center mr-4">
                <i className="far fa-eye mr-1"></i>
                {formatViewCount(article.viewCount)}
              </span>
              <span className="flex items-center">
                <i className="far fa-comment mr-1"></i>
                {article.commentCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

