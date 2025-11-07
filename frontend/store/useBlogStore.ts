import { create } from 'zustand'
import { Article, Category, Tag, Author } from '@/lib/api'

interface BlogState {
  // Articles
  articles: Article[]
  featuredArticle: Article | null
  popularArticles: Article[]
  currentArticle: Article | null
  loading: boolean
  error: string | null

  // Categories
  categories: Category[]
  selectedCategoryId: number | null

  // Tags
  tags: Tag[]
  popularTags: Tag[]

  // Author
  author: Author | null

  // Actions
  setArticles: (articles: Article[]) => void
  setFeaturedArticle: (article: Article | null) => void
  setPopularArticles: (articles: Article[]) => void
  setCurrentArticle: (article: Article | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCategories: (categories: Category[]) => void
  setSelectedCategoryId: (id: number | null) => void
  setTags: (tags: Tag[]) => void
  setPopularTags: (tags: Tag[]) => void
  setAuthor: (author: Author | null) => void
}

export const useBlogStore = create<BlogState>((set) => ({
  // Initial state
  articles: [],
  featuredArticle: null,
  popularArticles: [],
  currentArticle: null,
  loading: false,
  error: null,
  categories: [],
  selectedCategoryId: null,
  tags: [],
  popularTags: [],
  author: null,

  // Actions
  setArticles: (articles) => set({ articles }),
  setFeaturedArticle: (article) => set({ featuredArticle: article }),
  setPopularArticles: (articles) => set({ popularArticles: articles }),
  setCurrentArticle: (article) => set({ currentArticle: article }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCategories: (categories) => set({ categories }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setTags: (tags) => set({ tags }),
  setPopularTags: (tags) => set({ popularTags: tags }),
  setAuthor: (author) => set({ author }),
}))

