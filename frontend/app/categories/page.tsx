'use client'

import { useEffect, useState } from 'react'
import { Spin, Empty, Card } from 'antd'
import { useBlogStore } from '@/store/useBlogStore'
import { categoriesApi, articlesApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import ReadingProgress from '@/components/layout/ReadingProgress'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/articles/ArticleCard'
import SubscriptionForm from '@/components/sidebar/SubscriptionForm'
import { useRouter } from 'next/navigation'

export default function CategoriesPage() {
  const { categories, setCategories, setSelectedCategoryId } = useBlogStore()
  const [loading, setLoading] = useState(true)
  const [categoryArticles, setCategoryArticles] = useState<Record<number, any[]>>({})
  const router = useRouter()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const categoriesData = await categoriesApi.getAll()
      setCategories(categoriesData)

      // 加载每个分类的文章
      const articlesMap: Record<number, any[]> = {}
      for (const category of categoriesData) {
        const result = await articlesApi.getAll({
          page: 1,
          limit: 5,
          categoryId: category.id,
        })
        articlesMap[category.id] = result.data
      }
      setCategoryArticles(articlesMap)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
    router.push('/articles')
  }

  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="container mx-auto pt-28 pb-16 px-6 md:px-12 flex flex-col md:flex-row">
        {/* 主要内容区域 */}
        <div className="w-full md:w-2/3 lg:w-3/4 pr-0 md:pr-8">
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">文章分类</h1>
            <p className="text-slate-600">浏览所有文章分类，发现你感兴趣的内容</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <div className="space-y-8">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Card
                    key={category.id}
                    className="mb-6 fade-in"
                    hoverable
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <i className="fas fa-folder-open text-blue-500 text-2xl mr-3"></i>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">{category.name}</h2>
                          {category.description && (
                            <p className="text-slate-600 text-sm mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {categoryArticles[category.id]?.length || 0}
                        </div>
                        <div className="text-sm text-slate-500">篇文章</div>
                      </div>
                    </div>

                    {/* 该分类下的文章预览 */}
                    {categoryArticles[category.id] && categoryArticles[category.id].length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="space-y-4">
                          {categoryArticles[category.id].slice(0, 3).map((article) => (
                            <div
                              key={article.id}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/articles/${article.id}`)
                              }}
                            >
                              {article.coverImage && (
                                <img
                                  src={article.coverImage}
                                  alt={article.title}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="font-medium text-slate-800 hover:text-blue-500">
                                  {article.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                  {article.summary}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {categoryArticles[category.id].length > 3 && (
                          <div className="mt-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCategoryClick(category.id)
                              }}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
                            >
                              查看全部 {categoryArticles[category.id].length} 篇文章 →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Empty description="暂无分类" className="py-20" />
              )}
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <aside className="w-full md:w-1/3 lg:w-1/4 mt-12 md:mt-0 space-y-8">
          <SubscriptionForm />
        </aside>
      </main>
      <Footer categories={categories} />
    </>
  )
}

