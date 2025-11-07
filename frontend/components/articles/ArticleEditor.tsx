'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { markdown } from '@codemirror/lang-markdown'
import { autocompletion } from '@codemirror/autocomplete'
import { oneDark } from '@codemirror/theme-one-dark'
import MarkdownRenderer from '../MarkdownRenderer'

// 动态导入 CodeMirror，避免 SSR 问题
const CodeMirror = dynamic(() => import('@uiw/react-codemirror').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center border border-slate-200 rounded-xl" style={{ height: 600 }}>
      <div className="text-slate-500">加载编辑器...</div>
    </div>
  ),
})

interface ArticleEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  height?: number
}

// Markdown 代码补全配置
const markdownCompletions = autocompletion({
  override: [
    (context) => {
      const word = context.matchBefore(/\w*/)
      if (word && word.from === word.to && !context.explicit) return null
      return {
        from: word ? word.from : context.pos,
        options: [
          {
            label: '# 标题1',
            type: 'snippet',
            apply: '# ${1:标题}\n',
          },
          {
            label: '## 标题2',
            type: 'snippet',
            apply: '## ${1:标题}\n',
          },
          {
            label: '### 标题3',
            type: 'snippet',
            apply: '### ${1:标题}\n',
          },
          {
            label: '**粗体**',
            type: 'snippet',
            apply: '**${1:文本}**',
          },
          {
            label: '*斜体*',
            type: 'snippet',
            apply: '*${1:文本}*',
          },
          {
            label: '[链接](url)',
            type: 'snippet',
            apply: '[${1:链接文本}](${2:url})',
          },
          {
            label: '![图片](url)',
            type: 'snippet',
            apply: '![${1:alt}](${2:url})',
          },
          {
            label: '```代码块```',
            type: 'snippet',
            apply: '```${1:language}\n${2:code}\n```',
          },
          {
            label: '> 引用',
            type: 'snippet',
            apply: '> ${1:引用内容}',
          },
          {
            label: '- 列表',
            type: 'snippet',
            apply: '- ${1:列表项}',
          },
          {
            label: '1. 列表',
            type: 'snippet',
            apply: '1. ${1:列表项}',
          },
        ],
      }
    },
  ],
})

export default function ArticleEditor({
  value = '',
  onChange,
  placeholder = '开始编写你的 Markdown 内容...',
  height = 600,
}: ArticleEditorProps) {
  const [editorValue, setEditorValue] = useState(value)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('split')

  useEffect(() => {
    setEditorValue(value)
  }, [value])

  const handleChange = (val: string) => {
    setEditorValue(val)
    onChange?.(val)
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* 工具栏 */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <div className="text-sm text-slate-600 font-medium">Markdown 编辑器</div>
        <div className="flex items-center space-x-1 bg-white rounded-lg p-0.5 shadow-sm">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'edit'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-code mr-1.5"></i>编辑
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-eye mr-1.5"></i>预览
          </button>
          <button
            onClick={() => setActiveTab('split')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'split'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-columns mr-1.5"></i>分屏
          </button>
        </div>
      </div>

      {/* 编辑器内容 */}
      <div className="relative">
        {activeTab === 'edit' && (
          <CodeMirror
            value={editorValue}
            height={`${height}px`}
            extensions={[markdown(), markdownCompletions]}
            onChange={handleChange}
            placeholder={placeholder}
            theme="light"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: true,
            }}
          />
        )}

        {activeTab === 'preview' && (
          <div
            className="p-8 overflow-y-auto bg-gradient-to-b from-white to-slate-50"
            style={{ height, minHeight: height }}
          >
            <div className="max-w-3xl mx-auto">
              <MarkdownRenderer content={editorValue || '*暂无内容*'} />
            </div>
          </div>
        )}

        {activeTab === 'split' && (
          <div className="flex" style={{ height }}>
            <div className="flex-1 border-r border-slate-200">
              <CodeMirror
                value={editorValue}
                height={`${height}px`}
                extensions={[markdown(), markdownCompletions]}
                onChange={handleChange}
                placeholder={placeholder}
                theme="light"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  highlightSelectionMatches: true,
                }}
              />
            </div>
            <div
              className="flex-1 p-8 overflow-y-auto bg-white"
              style={{ height, minHeight: height }}
            >
              <div className="max-w-3xl mx-auto">
                <MarkdownRenderer content={editorValue || '*暂无内容*'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
