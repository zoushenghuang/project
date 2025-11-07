'use client'

import { useState } from 'react'
import { Input } from 'antd'
import MarkdownRenderer from './MarkdownRenderer'

const { TextArea } = Input

interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  height?: number
  showPreview?: boolean
}

export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = '开始编写你的 Markdown 内容...',
  height = 400,
  showPreview = true,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {showPreview && (
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'edit'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            编辑
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            预览
          </button>
        </div>
      )}

      <div className="relative">
        {activeTab === 'edit' || !showPreview ? (
          <TextArea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            style={{ height, minHeight: height }}
            className="font-mono text-sm"
          />
        ) : (
          <div
            className="p-4 overflow-y-auto bg-white"
            style={{ height, minHeight: height }}
          >
            <MarkdownRenderer content={value || '*暂无内容*'} />
          </div>
        )}
      </div>
    </div>
  )
}

