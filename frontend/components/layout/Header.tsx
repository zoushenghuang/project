'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from 'antd'
import { MenuOutlined, CloseOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBlogStore } from '@/store/useBlogStore'


export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const { setSelectedCategoryId } = useBlogStore()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setSelectedCategoryId(null)
      router.push(`/articles?search=${encodeURIComponent(value)}`)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300 ${
        scrolled ? 'nav-scrolled bg-white/95' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-slate-800 flex items-center">
          <i className="fas fa-feather-alt mr-2 text-blue-500"></i>
          <span>Minimal</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-slate-700 hover:text-blue-500 transition-colors font-medium">
            首页
          </Link>
          <Link href="/articles" className="text-slate-700 hover:text-blue-500 transition-colors font-medium">
            文章
          </Link>
          <Link href="/categories" className="text-slate-700 hover:text-blue-500 transition-colors font-medium">
            分类
          </Link>
          <Link href="/about" className="text-slate-700 hover:text-blue-500 transition-colors font-medium">
            关于
          </Link>
        </div>

        {/* Search and User */}
        <div className="flex items-center space-x-4">
          <div className="relative search-input">
            <input
              type="text"
              placeholder="搜索文章..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.currentTarget.value)
                }
              }}
              className="pl-10 pr-4 py-2 rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm w-40 md:w-56"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
          </div>

          <div className="relative" ref={userMenuRef}>
            <div
              className="author-avatar cursor-pointer"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <img
                src="https://s.coze.cn/image/-ccG_QWFeVg/"
                alt="用户头像"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm hover:border-blue-500 transition-colors"
              />
            </div>

            {/* 用户下拉菜单 */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <div
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center space-x-2 text-slate-700"
                  onClick={() => {
                    router.push('/articles/new')
                    setUserMenuOpen(false)
                  }}
                >
                  <EditOutlined />
                  <span>发布文章</span>
                </div>
                <div className="border-t border-slate-200 my-1"></div>
                <div
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center space-x-2 text-slate-700"
                  onClick={() => {
                    router.push('/profile')
                    setUserMenuOpen(false)
                  }}
                >
                  <UserOutlined />
                  <span>个人中心</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            className="md:hidden text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white rounded-lg shadow-lg mt-4 p-4 absolute left-6 right-6">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-slate-700 hover:text-blue-500 transition-colors font-medium py-2 px-3 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/articles"
              className="text-slate-700 hover:text-blue-500 transition-colors font-medium py-2 px-3 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              文章
            </Link>
            <Link
              href="/categories"
              className="text-slate-700 hover:text-blue-500 transition-colors font-medium py-2 px-3 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              分类
            </Link>
            <Link
              href="/about"
              className="text-slate-700 hover:text-blue-500 transition-colors font-medium py-2 px-3 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              关于
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

