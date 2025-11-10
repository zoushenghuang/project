'use client'

import { useEffect, useState } from 'react'
import { Spin, Card } from 'antd'
import { articlesApi } from '@/lib/api'
import Header from '@/components/layout/Header'
import ReadingProgress from '@/components/layout/ReadingProgress'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/articles/ArticleCard'
import SubscriptionForm from '@/components/sidebar/SubscriptionForm'

// 博客主人信息（固定信息）
const blogOwner = {
  name: '邹圣煌',
  title: '前端开发师',
  bio: '热爱编程，分享技术心得与生活感悟',
  avatar: 'https://s.coze.cn/image/-ccG_QWFeVg/',
  email: 'hello@example.com',
  socialLinks: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
}

export default function AboutPage() {
  const [popularArticles, setPopularArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const popular = await articlesApi.getPopular(3)
      setPopularArticles(popular)
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
      <main className="container mx-auto pt-28 pb-16 px-6 md:px-12 flex flex-col md:flex-row">
        {/* 主要内容区域 */}
        <div className="w-full md:w-2/3 lg:w-3/4 pr-0 md:pr-8">
          <div className="space-y-8">
            {/* 博主介绍卡片 */}
            <Card className="fade-in">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src={blogOwner.avatar}
                  alt={blogOwner.name}
                  className="w-24 h-24 md:w-30 md:h-30 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{blogOwner.name}</h1>
                  {blogOwner.title && (
                    <p className="text-xl text-slate-500 mb-4">{blogOwner.title}</p>
                  )}
                  {blogOwner.bio && (
                    <p className="text-slate-600 leading-relaxed mb-6">{blogOwner.bio}</p>
                  )}
                  {blogOwner.socialLinks && (
                    <div className="flex justify-center md:justify-start space-x-3">
                      {blogOwner.socialLinks.twitter && (
                        <a
                          href={blogOwner.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon text-slate-500 hover:text-blue-500"
                        >
                          <i className="fab fa-twitter"></i>
                        </a>
                      )}
                      {blogOwner.socialLinks.linkedin && (
                        <a
                          href={blogOwner.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon text-slate-500 hover:text-blue-500"
                        >
                          <i className="fab fa-linkedin"></i>
                        </a>
                      )}
                      {blogOwner.socialLinks.github && (
                        <a
                          href={blogOwner.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon text-slate-500 hover:text-blue-500"
                        >
                          <i className="fab fa-github"></i>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 博客介绍 */}
            <Card className="fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">关于这个博客</h2>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>
                  Minimal 是一个专注于简约生活与高效工作的个人博客。在这里，我们分享关于科技、生活方式和个人成长的思考与经验。
                </p>
                <p>
                  我们的使命是帮助读者在数字时代找到工作与生活的平衡，通过实用的建议和工具，提升生活质量和工作效率。
                </p>
                <p>
                  无论你是追求极简生活的实践者，还是希望提升工作效率的职场人士，这里都有适合你的内容。
                </p>
              </div>
            </Card>

            {/* 联系方式 */}
            <Card className="fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">联系我</h2>
              <div className="space-y-3">
                <div className="flex items-center text-slate-600">
                  <i className="fas fa-envelope mr-3 text-blue-500"></i>
                  <a href={`mailto:${blogOwner.email}`} className="hover:text-blue-500">
                    {blogOwner.email}
                  </a>
                </div>
              </div>
            </Card>

            {/* 热门文章 */}
            {popularArticles.length > 0 && (
              <div className="fade-in">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">热门文章</h2>
                <div className="space-y-6">
                  {popularArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 侧边栏 */}
        <aside className="w-full md:w-1/3 lg:w-1/4 mt-12 md:mt-0 space-y-8">
          <SubscriptionForm />
        </aside>
      </main>
      <Footer />
    </>
  )
}

