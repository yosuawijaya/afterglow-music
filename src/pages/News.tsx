import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, TrendingUp } from 'lucide-react'
import { newsAPI, News as NewsType } from '../services/api'
import VerifiedBadge from '../components/VerifiedBadge'
import SEO from '../components/SEO'
import './News.css'

const News = () => {
  const [news, setNews] = useState<NewsType[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredNews, setFeaturedNews] = useState<NewsType | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const data = await newsAPI.getAll()
      setNews(data)
      if (data.length > 0) {
        setFeaturedNews(data[0]) // First news as featured
      }
    } catch (error) {
      console.error('Failed to load news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
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

  const otherNews = news.slice(1)
  const trendingNews = news.slice(0, 4)

  return (
    <div className="news-page">
      <SEO 
        title="News - Afterglow Music | Berita Musik & Artis Terbaru"
        description="Baca berita terbaru tentang rilis musik, artis, dan update dari Afterglow Music. Temukan informasi terkini dari independent record label Indonesia."
        keywords="berita musik indonesia, news afterglow music, rilis musik terbaru, update artis, musik indonesia"
      />
      
      {/* Featured Hero */}
      {featuredNews && (
        <motion.div
          className="news-hero-featured"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="featured-bg" style={{ backgroundImage: `url(${featuredNews.coverImage})` }}>
            <div className="featured-overlay"></div>
          </div>
          <div className="featured-content">
            <motion.div
              className="featured-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              FEATURED
            </motion.div>
            <motion.h1
              className="featured-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {featuredNews.title}
            </motion.h1>
            <motion.p
              className="featured-excerpt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {featuredNews.excerpt}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to={`/news/${featuredNews.slug}`} className="featured-button">
                Read More
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}

      <div className="news-main-container">
        {/* Main Content */}
        <div className="news-content-area">
          <div className="section-header">
            <h2>Latest News</h2>
            <div className="header-line"></div>
          </div>

          {otherNews.length === 0 ? (
            <div className="no-news">
              <p>No more news available. Check back soon!</p>
            </div>
          ) : (
            <div className="news-grid">
              {otherNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  className="news-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/news/${item.slug}`} className="news-card-image">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} />
                    ) : (
                      <div className="news-card-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </Link>
                  <div className="news-card-content">
                    <div className="news-card-meta">
                      <span className="news-meta-item">
                        <Calendar size={14} />
                        {formatDate(item.publishedAt)}
                      </span>
                      <span className="news-meta-item">
                        <User size={14} />
                        <span className="author-with-badge">
                          {item.author}
                          <VerifiedBadge author={item.author} size={14} />
                        </span>
                      </span>
                    </div>
                    <Link to={`/news/${item.slug}`}>
                      <h3 className="news-card-title">{item.title}</h3>
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

        {/* Sidebar */}
        <aside className="news-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-header">
              <TrendingUp size={20} />
              <h3>Trending Now</h3>
            </div>
            <div className="trending-list">
              {trendingNews.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="trending-item"
                >
                  <div className="trending-number">{index + 1}</div>
                  <div className="trending-content">
                    <h4>{item.title}</h4>
                    <span className="trending-date">{formatDate(item.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-section sidebar-cta">
            <h3>Submit Your Music</h3>
            <p>Got a demo? We'd love to hear from you!</p>
            <Link to="/submit" className="sidebar-button">
              Submit Now
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default News
