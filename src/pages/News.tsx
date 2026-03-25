import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { newsAPI, News as NewsType } from '../services/api'
import './News.css'

const News = () => {
  const [news, setNews] = useState<NewsType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const data = await newsAPI.getAll()
      setNews(data)
    } catch (error) {
      console.error('Failed to load news:', error)
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
      <div className="news-page">
        <div className="news-container">
          <div className="loading">Loading news...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="news-page">
      <div className="news-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Latest News
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Stay updated with the latest from Afterglow Music
        </motion.p>
      </div>

      <div className="news-container">
        {news.length === 0 ? (
          <div className="no-news">
            <p>No news available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="news-grid">
            {news.map((item, index) => (
              <motion.article
                key={item.id}
                className="news-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item.coverImage && (
                  <Link to={`/news/${item.slug}`} className="news-card-image">
                    <img src={item.coverImage} alt={item.title} />
                  </Link>
                )}
                <div className="news-card-content">
                  <div className="news-card-meta">
                    <span className="news-meta-item">
                      <Calendar size={16} />
                      {formatDate(item.publishedAt)}
                    </span>
                    <span className="news-meta-item">
                      <User size={16} />
                      {item.author}
                    </span>
                  </div>
                  <Link to={`/news/${item.slug}`}>
                    <h2 className="news-card-title">{item.title}</h2>
                  </Link>
                  <p className="news-card-excerpt">{item.excerpt}</p>
                  <Link to={`/news/${item.slug}`} className="news-card-link">
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default News
