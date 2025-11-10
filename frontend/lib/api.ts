import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Article {
  id: number
  title: string
  summary: string
  content: string
  coverImage?: string
  isFeatured: boolean
  viewCount: number
  commentCount: number
  category?: Category
  tags?: Tag[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description?: string
  color?: string
  articles?: Article[]
}

export interface Tag {
  id: number
  name: string
  articles?: Article[]
}

export interface Subscription {
  id: number
  email: string
  subscribedAt: string
}

export interface Author {
  id: number
  name: string
  title?: string
  bio?: string
  avatar?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    linkedin?: string
    github?: string
  }
}

export interface ArticlesResponse {
  data: Article[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Articles API
export const articlesApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    categoryId?: number
    tagId?: number
    isFeatured?: boolean
    search?: string
  }): Promise<ArticlesResponse> => {
    const response = await api.get<ArticlesResponse>('/articles', { params })
    return response.data
  },

  getFeatured: async (): Promise<Article[]> => {
    const response = await api.get<Article[]>('/articles/featured')
    return response.data
  },

  getPopular: async (limit: number = 5): Promise<Article[]> => {
    const response = await api.get<Article[]>('/articles/popular', {
      params: { limit },
    })
    return response.data
  },

  getById: async (id: number): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${id}`)
    return response.data
  },

  incrementView: async (id: number): Promise<void> => {
    await api.post(`/articles/${id}/view`)
  },

  create: async (data: {
    title: string
    summary: string
    content: string
    coverImage?: string
    isFeatured?: boolean
    categoryId: number
    tagIds?: number[]
  }): Promise<Article> => {
    const response = await api.post<Article>('/articles', data)
    return response.data
  },
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },
}

// Tags API
export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get<Tag[]>('/tags')
    return response.data
  },

  getPopular: async (): Promise<Tag[]> => {
    const response = await api.get<Tag[]>('/tags/popular')
    return response.data
  },
}

// Subscriptions API
export const subscriptionsApi = {
  create: async (email: string): Promise<Subscription> => {
    const response = await api.post<Subscription>('/subscriptions', { email })
    return response.data
  },
}

export default api

