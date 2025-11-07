'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Select, Button, Upload, Switch, message, Card } from 'antd'
import { SaveOutlined, SendOutlined, ArrowLeftOutlined, PictureOutlined } from '@ant-design/icons'
import { articlesApi, categoriesApi, tagsApi, Category, Tag } from '@/lib/api'
import Header from '@/components/layout/Header'
import ReadingProgress from '@/components/layout/ReadingProgress'
import Footer from '@/components/layout/Footer'
import ArticleEditor from '@/components/articles/ArticleEditor'

const { TextArea } = Input
const { Option } = Select

export default function NewArticlePage() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [content, setContent] = useState('')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        categoriesApi.getAll(),
        tagsApi.getAll(),
      ])
      setCategories(categoriesData)
      setTags(tagsData)
    } catch (error) {
      console.error('加载数据失败:', error)
      message.error('加载数据失败')
    }
  }

  const handleSubmit = async (values: any) => {
    if (!content.trim()) {
      message.warning('请输入文章内容')
      return
    }

    setLoading(true)
    try {
      const articleData = {
        title: values.title,
        summary: values.summary,
        content: content,
        coverImage: values.coverImage,
        isFeatured: values.isFeatured || false,
        categoryId: values.categoryId,
        tagIds: values.tagIds || [],
      }

      const article = await articlesApi.create(articleData)
      message.success('文章发布成功！')
      router.push(`/articles/${article.id}`)
    } catch (error: any) {
      console.error('发布失败:', error)
      message.error(error.response?.data?.message || '发布失败，请稍后重试')
    } finally {
      setLoading(false)
    }
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

          <Card>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">发布新文章</h1>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-6"
            >
              {/* 标题 */}
              <Form.Item
                name="title"
                label="文章标题"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input
                  size="large"
                  placeholder="请输入文章标题"
                  className="text-lg"
                />
              </Form.Item>

              {/* 摘要 */}
              <Form.Item
                name="summary"
                label="文章摘要"
                rules={[{ required: true, message: '请输入文章摘要' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="请输入文章摘要，将显示在文章列表中"
                  showCount
                  maxLength={200}
                />
              </Form.Item>

              {/* 分类 */}
              <div className="grid grid-cols-1 gap-4">
                <Form.Item
                  name="categoryId"
                  label="分类"
                  rules={[{ required: true, message: '请选择分类' }]}
                >
                  <Select
                    size="large"
                    placeholder="选择分类"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* 标签 */}
              <Form.Item name="tagIds" label="标签">
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="选择标签（可选）"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {tags.map((tag) => (
                    <Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* 封面图片 */}
              <Form.Item name="coverImage" label="封面图片 URL">
                <Input
                  size="large"
                  placeholder="输入封面图片 URL（可选）"
                  prefix={<PictureOutlined className="text-slate-400" />}
                />
              </Form.Item>

              {/* 文章内容编辑器 */}
              <Form.Item
                label="文章内容（Markdown）"
                required
              >
                <ArticleEditor
                  value={content}
                  onChange={setContent}
                  placeholder="开始编写你的 Markdown 内容..."
                  height={600}
                />
              </Form.Item>

              {/* 特色文章开关 */}
              <Form.Item name="isFeatured" valuePropName="checked">
                <div className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-slate-600">设为特色文章</span>
                </div>
              </Form.Item>

              {/* 提交按钮 */}
              <Form.Item>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="default"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-md hover:shadow-lg"
                  >
                    发布文章
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </main>
      <Footer categories={categories} />
    </>
  )
}

