'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spin, Empty, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { articlesApi } from '@/lib/api'
import { formatDate, formatViewCount, getCategoryColor } from '@/lib/utils'
import Header from '@/components/layout/Header'
import ReadingProgress from '@/components/layout/ReadingProgress'
import Footer from '@/components/layout/Footer'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Image from 'next/image'

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = Number(params.id)
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const viewIncremented = useRef(false)

  useEffect(() => {
    if (articleId) {
      // 重置阅读量标记，当文章ID变化时
      viewIncremented.current = false
      loadArticle()
    }
  }, [articleId])

  const loadArticle = async () => {
    setLoading(true)
    try {
      const data = await articlesApi.getById(articleId)
      setArticle(data)
      
      // 防止重复增加阅读量
      if (!viewIncremented.current) {
        viewIncremented.current = true
        // 异步增加阅读量，不阻塞页面加载
        articlesApi.incrementView(articleId).catch((error) => {
          console.error('增加阅读量失败:', error)
        })
        // 更新本地显示的阅读量
        setArticle((prev: any) => ({
          ...prev,
          viewCount: prev.viewCount + 1,
        }))
      }
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto pt-28 pb-16 px-6 md:px-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spin size="large" />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!article) {
    return (
      <>
        <Header />
        <div className="container mx-auto pt-28 pb-16 px-6 md:px-12">
          <Empty description="文章不存在" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="container mx-auto pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="mb-6 px-0"
          >
            返回
          </Button>

          {/* 文章头部 */}
          <article className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
            {article.coverImage && (
              <div className="relative h-64 md:h-96 mb-6">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.category?.name)}`}>
                  {article.category?.name || '未分类'}
                </span>
                <span className="ml-auto text-sm text-slate-500">
                  {formatDate(article.createdAt)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                {article.title}
              </h1>

              <p className="text-xl text-slate-600 mb-6">{article.summary}</p>

              <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
                <div className="flex items-center text-sm text-slate-500">
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center text-slate-500 space-x-4">
                  <span>
                    <i className="far fa-eye mr-1"></i>
                    {formatViewCount(article.viewCount)}
                  </span>
                  <span>
                    <i className="far fa-comment mr-1"></i>
                    {article.commentCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* 文章内容 */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <MarkdownRenderer content={article.content} />
          </div>

          {/* 标签 */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">标签</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

