import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import zhCN from 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale(zhCN)

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('YYYY年MM月DD日')
}

export const formatRelativeTime = (dateString: string): string => {
  return dayjs(dateString).fromNow()
}

export const formatViewCount = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

export const getCategoryColor = (categoryName?: string): string => {
  const colorMap: Record<string, string> = {
    科技创新: 'bg-purple-100 text-purple-600',
    生活方式: 'bg-blue-100 text-blue-600',
    职场发展: 'bg-orange-100 text-orange-600',
    健康生活: 'bg-green-100 text-green-600',
    读书笔记: 'bg-pink-100 text-pink-600',
  }
  return colorMap[categoryName || ''] || 'bg-slate-100 text-slate-600'
}

