'use client'

import { useEffect, useState } from 'react'
import { Spin, Card, Button, Tabs, Empty } from 'antd'
import { ArrowLeftOutlined, EditOutlined, UserOutlined, BookOutlined, EyeOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { articlesApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import ReadingProgress from '@/components/layout/ReadingProgress'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/articles/ArticleCard'

const { TabPane } = Tabs

// 博客主人信息（固定信息，不依赖数据库）
const blogOwner = {
  name: '邹圣煌',
  title: '前端开发师',
  bio: '热爱编程，分享技术心得与生活感悟',
  avatar: 'https://s.coze.cn/image/-ccG_QWFeVg/',
  email: '1020374925@qq.com',
  socialLinks: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const [myArticles, setMyArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // 获取所有文章（个人博客，所有文章都是博主发布的）
      const result = await articlesApi.getAll({ page: 1, limit: 100 })
      setMyArticles(result.data)
    } catch (error) {
      console.error('加载数据失败:', error)
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

  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="container mx-auto pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* 返回按钮 */}
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="mb-6 px-0"
          >
            返回
          </Button>

          <div className="space-y-6">
            {/* 个人信息卡片 */}
            <Card className="fade-in">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <img
                    src={blogOwner.avatar}
                    alt={blogOwner.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{blogOwner.name}</h1>
                  {blogOwner.title && (
                    <p className="text-xl text-slate-500 mb-4">{blogOwner.title}</p>
                  )}
                  {blogOwner.bio && (
                    <p className="text-slate-600 leading-relaxed mb-6">{blogOwner.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center text-slate-600">
                      <BookOutlined className="mr-2 text-blue-500" />
                      <span className="font-medium">{myArticles.length}</span>
                      <span className="ml-1">篇文章</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <EyeOutlined className="mr-2 text-blue-500" />
                      <span className="font-medium">
                        {myArticles.reduce((sum, article) => sum + (article.viewCount || 0), 0)}
                      </span>
                      <span className="ml-1">次阅读</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 内容标签页 */}
            <Card className="fade-in">
              <Tabs defaultActiveKey="articles" size="large">
                <TabPane
                  tab={
                    <span>
                      <BookOutlined />
                      我的文章
                    </span>
                  }
                  key="articles"
                >
                  {myArticles.length > 0 ? (
                    <div className="space-y-6 mt-4">
                      {myArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  ) : (
                    <Empty
                      description="还没有发布任何文章"
                      className="py-12"
                    >
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => router.push('/articles/new')}
                      >
                        发布第一篇文章
                      </Button>
                    </Empty>
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <UserOutlined />
                      个人信息
                    </span>
                  }
                  key="info"
                >
                  <div className="space-y-6 mt-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">基本信息</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                          <span className="text-slate-600">姓名</span>
                          <span className="font-medium text-slate-800">{blogOwner.name}</span>
                        </div>
                        {blogOwner.title && (
                          <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <span className="text-slate-600">职位</span>
                            <span className="font-medium text-slate-800">{blogOwner.title}</span>
                          </div>
                        )}
                        {blogOwner.email && (
                          <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <span className="text-slate-600">邮箱</span>
                            <span className="font-medium text-slate-800">{blogOwner.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {blogOwner.bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">个人简介</h3>
                        <p className="text-slate-600 leading-relaxed">{blogOwner.bio}</p>
                      </div>
                    )}

                    {blogOwner.socialLinks && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">社交链接</h3>
                        <div className="flex flex-wrap gap-3">
                          {blogOwner.socialLinks.twitter && (
                            <a
                              href={blogOwner.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center"
                            >
                              <i className="fab fa-twitter mr-2"></i>
                              Twitter
                            </a>
                          )}
                          {blogOwner.socialLinks.github && (
                            <a
                              href={blogOwner.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all flex items-center"
                            >
                              <i className="fab fa-github mr-2"></i>
                              GitHub
                            </a>
                          )}
                          {blogOwner.socialLinks.linkedin && (
                            <a
                              href={blogOwner.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center"
                            >
                              <i className="fab fa-linkedin mr-2"></i>
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
