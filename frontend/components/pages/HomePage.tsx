'use client'

import { useEffect, useState } from 'react'
import { Button, Tag, Spin, Empty } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useBlogStore } from '@/store/useBlogStore'
import {
  articlesApi,
  categoriesApi,
  tagsApi,
} from '@/lib/api'
import Header from '@/components/layout/Header'
import ReadingProgress from '@/components/layout/ReadingProgress'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/articles/ArticleCard'
import CategoriesList from '@/components/sidebar/CategoriesList'
import PopularArticles from '@/components/sidebar/PopularArticles'
import TagsCloud from '@/components/sidebar/TagsCloud'
import SubscriptionForm from '@/components/sidebar/SubscriptionForm'

export default function HomePage() {
  const {
    articles,
    featuredArticle,
    popularArticles,
    categories,
    popularTags,
    setArticles,
    setFeaturedArticle,
    setPopularArticles,
    setCategories,
    setPopularTags,
    setLoading,
    selectedCategoryId,
  } = useBlogStore()

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 加载初始数据
  useEffect(() => {
    loadInitialData()
  }, [])

  // 当分类或搜索变化时重新加载文章
  useEffect(() => {
    loadArticles(1, true)
  }, [selectedCategoryId, searchKeyword])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [
        featured,
        popular,
        categoriesData,
        tagsData,
      ] = await Promise.all([
        articlesApi.getFeatured(),
        articlesApi.getPopular(4),
        categoriesApi.getAll(),
        tagsApi.getPopular(),
      ])

      if (featured.length > 0) {
        setFeaturedArticle(featured[0])
      }
      setPopularArticles(popular)
      setCategories(categoriesData)
      setPopularTags(tagsData)
    } catch (error) {
      console.error('加载初始数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadArticles = async (pageNum: number, reset: boolean = false) => {
    if (loadingMore && !reset) return

    setLoadingMore(true)
    try {
      const result = await articlesApi.getAll({
        page: pageNum,
        limit: 10,
        categoryId: selectedCategoryId || undefined,
        search: searchKeyword || undefined,
      })

      if (reset) {
        setArticles(result.data)
      } else {
        setArticles([...articles, ...result.data])
      }

      setHasMore(result.page < result.totalPages)
      setPage(pageNum)
    } catch (error) {
      console.error('加载文章失败:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore) {
      loadArticles(page + 1)
    }
  }

  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="container mx-auto pt-28 pb-16 px-6 md:px-12 flex flex-col md:flex-row">
        {/* 文章列表区域 */}
        <div className="w-full md:w-2/3 lg:w-3/4 pr-0 md:pr-8">
          {/* 特色文章 */}
          {featuredArticle && (
            <ArticleCard article={featuredArticle} featured />
          )}

          {/* 最新文章标题 */}
          <div className="flex items-center justify-between mb-6 fade-in">
            <h2 className="text-2xl font-bold text-slate-800">最新文章</h2>
            <div className="hidden md:flex space-x-2">
              <button
                className={`category-tag px-4 py-1 rounded-full text-sm font-medium ${
                  !selectedCategoryId
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
                onClick={() => useBlogStore.getState().setSelectedCategoryId(null)}
              >
                全部
              </button>
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category.id}
                  className={`category-tag px-4 py-1 rounded-full text-sm font-medium ${
                    selectedCategoryId === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                  onClick={() =>
                    useBlogStore.getState().setSelectedCategoryId(category.id)
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 文章列表 */}
          <div className="space-y-8">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <Empty description="暂无文章" />
            )}
          </div>

          {/* 加载更多按钮 */}
          {hasMore && (
            <div className="mt-10 text-center fade-in">
              <Button
                type="default"
                size="large"
                icon={<DownOutlined />}
                loading={loadingMore}
                onClick={handleLoadMore}
                className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                加载更多文章
              </Button>
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <aside className="w-full md:w-1/3 lg:w-1/4 mt-12 md:mt-0 space-y-8">
          <CategoriesList categories={categories} />
          <PopularArticles articles={popularArticles} />
          <TagsCloud tags={popularTags} />
          <SubscriptionForm />
        </aside>
      </main>
      <Footer categories={categories} />
    </>
  )
}

