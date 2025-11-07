'use client'

import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { subscriptionsApi } from '@/lib/api'

export default function SubscriptionForm() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true)
    try {
      await subscriptionsApi.create(values.email)
      message.success('订阅成功！')
      form.resetFields()
    } catch (error: any) {
      message.error(error.response?.data?.message || '订阅失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md fade-in">
      <h3 className="text-lg font-bold mb-2">订阅更新</h3>
      <p className="text-blue-100 text-sm mb-4">
        获取最新文章和独家内容，直接发送到您的邮箱。
      </p>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input
            placeholder="您的邮箱地址"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
          >
            立即订阅
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

