'use client'

import { Category } from '@/lib/api'
import { useBlogStore } from '@/store/useBlogStore'
import { useRouter } from 'next/navigation'

interface CategoriesListProps {
  categories: Category[]
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  const { selectedCategoryId, setSelectedCategoryId } = useBlogStore()
  const router = useRouter()

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm fade-in">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <i className="fas fa-folder-open text-blue-500 mr-2"></i>
        文章分类
      </h3>
      <div className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <a
              key={category.id}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setSelectedCategoryId(category.id)
                router.push('/articles')
              }}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                selectedCategoryId === category.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-slate-50'
              }`}
            >
              <span className="text-slate-700">{category.name}</span>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                {category.articles?.length || 0}
              </span>
            </a>
          ))
        ) : (
          <div className="text-slate-500 text-sm text-center py-4">暂无分类</div>
        )}
      </div>
    </div>
  )
}

