'use client'

import Link from 'next/link'
import { MailOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { Category } from '@/lib/api'

interface FooterProps {
  categories?: Category[]
}

export default function Footer({ categories = [] }: FooterProps) {
  return (
    <footer className="bg-slate-800 text-slate-300 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4">
              <Link href="/" className="flex items-center">
                <i className="fas fa-feather-alt mr-2 text-blue-400"></i>
                <span>Minimal</span>
              </Link>
            </h4>
            <p className="text-slate-400 mb-4">
              探索简约生活与高效工作的平衡点，发现数字时代的生活美学。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">快速链接</h4>
            <ul className="list-none p-0 space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-slate-400 hover:text-white transition-colors">
                  文章
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-slate-400 hover:text-white transition-colors">
                  分类
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">热门分类</h4>
            <ul className="list-none p-0 space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">联系我</h4>
            <ul className="list-none p-0 space-y-2">
              <li className="flex items-center">
                <MailOutlined className="mr-2 text-blue-400" />
                <a href="mailto:hello@minimal.com" className="text-slate-400 hover:text-white transition-colors">
                  1020377237@qq.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0">
            <p className="text-slate-400 text-sm order-1 md:order-1">
              © 2025 Minimal 博客. 保留所有权利
            </p>
            {/* <div className="flex space-x-6 order-3 md:order-3">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                隐私政策
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                使用条款
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Cookie 政策
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

