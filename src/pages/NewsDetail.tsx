import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { newsAPI, News } from '../services/api'
import './NewsDetail.css'

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (slug) {
      loadNews(slug)
    }
  }, [slug])

  const loadNews = async (slug: string) => {
    try {
      const data = await newsAPI.getBySlug(slug)
      setNews(data)
    } catch (error) {
      console.error('Failed to load news:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-container">
          <div className="error-message">
            <h2>News not found</h2>
            <p>The news article you're looking for doesn't exist.</p>
            <Link to="/news" className="back-button">
              <ArrowLeft size={20} />
              Back to News
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="news-detail-page">
      <motion.div
        className="news-detail-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/news" className="back-link">
          <ArrowLeft size={20} />
          Back to News
        </Link>

        <article className="news-detail">
          {news.coverImage && (
            <motion.div
              className="news-detail-cover"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img src={news.coverImage} alt={news.title} />
            </motion.div>
          )}

          <motion.div
            className="news-detail-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="news-detail-meta">
              <span className="news-meta-item">
                <Calendar size={18} />
                {formatDate(news.publishedAt)}
              </span>
              <span className="news-meta-item">
                <User size={18} />
                {news.author}
              </span>
            </div>

            <h1 className="news-detail-title">{news.title}</h1>

            <div 
              className="news-detail-body"
              dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br>') }}
            />
          </motion.div>
        </article>
      </motion.div>
    </div>
  )
}

export default NewsDetail
