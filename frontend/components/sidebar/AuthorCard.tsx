'use client'

import { Author } from '@/lib/api'

interface AuthorCardProps {
  author: Author | null
}

export default function AuthorCard({ author }: AuthorCardProps) {
  if (!author) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 flex items-center justify-center">
            <div className="loading w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm fade-in">
      <div className="flex flex-col items-center text-center">
        <img
          src={author.avatar || 'https://via.placeholder.com/96'}
          alt={author.name}
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md author-avatar"
        />
        <h3 className="text-xl font-bold mb-2">{author.name}</h3>
        <p className="text-slate-500 mb-4">{author.title || '博主'}</p>
        <p className="text-sm text-slate-600 mb-4">
          {author.bio || '分享关于科技、生活方式和个人成长的思考与经验。'}
        </p>
        <div className="flex space-x-3">
          {author.socialLinks?.twitter && (
            <a
              href={author.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon text-slate-500 hover:text-blue-500"
            >
              <i className="fab fa-twitter"></i>
            </a>
          )}
          {author.socialLinks?.instagram && (
            <a
              href={author.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon text-slate-500 hover:text-blue-500"
            >
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {author.socialLinks?.linkedin && (
            <a
              href={author.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon text-slate-500 hover:text-blue-500"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          )}
          {author.socialLinks?.github && (
            <a
              href={author.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon text-slate-500 hover:text-blue-500"
            >
              <i className="fab fa-github"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

