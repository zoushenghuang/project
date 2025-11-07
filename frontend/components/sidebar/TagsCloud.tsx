'use client'

import { Tag as TagType } from '@/lib/api'

interface TagsCloudProps {
  tags: TagType[]
}

export default function TagsCloud({ tags }: TagsCloudProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm fade-in">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <i className="fas fa-tags text-purple-500 mr-2"></i>
        热门标签
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <a
              key={tag.id}
              href="#"
              className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              #{tag.name}
            </a>
          ))
        ) : (
          <div className="text-slate-500 text-sm w-full text-center py-4">暂无标签</div>
        )}
      </div>
    </div>
  )
}

