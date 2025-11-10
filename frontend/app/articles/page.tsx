'use client'

import { useEffect, useState, useCallback, useRef, Suspense } from 'react'
import { Spin, Empty } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useBlogStore } from '@/store/useBlogStore'
import { articlesApi, categoriesApi, tagsApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import ReadingProgress from '@/components/layout/ReadingProgress'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/articles/ArticleCard'
import CategoriesList from '@/components/sidebar/CategoriesList'
import PopularArticles from '@/components/sidebar/PopularArticles'
import TagsCloud from '@/components/sidebar/TagsCloud'
import SubscriptionForm from '@/components/sidebar/SubscriptionForm'

function ArticlesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const {
    articles,
    popularArticles,
    categories,
    popularTags,
    setArticles,
    setPopularArticles,
    setCategories,
    setPopularTags,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useBlogStore()

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const initialSearch = searchParams.get('search') || ''
  const [searchKeyword, setSearchKeyword] = useState(initialSearch)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const searchKeywordRef = useRef(initialSearch)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    const search = searchParams.get('search')
    if (search !== null) {
      setSearchKeyword(search)
      setSearchInput(search)
      searchKeywordRef.current = search
    }
  }, [searchParams])

  useEffect(() => {
    loadArticles(1, true)
  }, [selectedCategoryId, searchKeyword])

  // 更新URL参数
  const updateSearchParams = useCallback((search: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, router, pathname])

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchKeywordRef.current) {
        searchKeywordRef.current = searchInput
        setSearchKeyword(searchInput)
        updateSearchParams(searchInput)
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput, updateSearchParams])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [popular, categoriesData, tagsData] = await Promise.all([
        articlesApi.getPopular(4),
        categoriesApi.getAll(),
        tagsApi.getPopular(),
      ])

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

  const handleSearch = (value: string) => {
    setSearchInput(value)
    setSearchKeyword(value)
    updateSearchParams(value)
    setPage(1)
  }

  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="container mx-auto pt-28 pb-16 px-6 md:px-12 flex flex-col md:flex-row">
        {/* 文章列表区域 */}
        <div className="w-full md:w-2/3 lg:w-3/4 pr-0 md:pr-8">
          {/* 页面标题和搜索 */}
          <div className="mb-8 fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">所有文章</h1>
            <div className="relative search-input max-w-md">
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value)
                  }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex items-center mb-6 fade-in flex-wrap gap-2">
            <button
              className={`category-tag px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                !selectedCategoryId
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => setSelectedCategoryId(null)}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tag px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                  selectedCategoryId === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <div className="space-y-8">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <Empty description="暂无文章" className="py-20" />
              )}
            </div>
          )}

          {/* 加载更多按钮 */}
          {hasMore && !loading && (
            <div className="mt-10 text-center fade-in">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {loadingMore ? (
                  <>
                    <Spin size="small" className="mr-2" />
                    加载中...
                  </>
                ) : (
                  <>
                    <DownOutlined className="mr-2" />
                    加载更多文章
                  </>
                )}
              </button>
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

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="container mx-auto pt-28 pb-16 px-6 md:px-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spin size="large" />
          </div>
        </div>
        <Footer />
      </>
    }>
      <ArticlesContent />
    </Suspense>
  )
}

