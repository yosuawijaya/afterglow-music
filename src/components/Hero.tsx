import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slidesAPI, HeroSlide } from '../services/api'
import './Hero.css'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    try {
      const data = await slidesAPI.getAll()
      console.log('Slides loaded:', data)
      setSlides(data)
    } catch (error) {
      console.error('Failed to load slides:', error)
      setSlides([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slides.length === 0) return
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading || slides.length === 0) {
    return (
      <section id="home" className="hero" style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <section id="home" className="hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="hero-slide-bg"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="hero-slide-overlay" />
          
          <div className="hero-slide-content">
            {!slides[currentSlide].is_banner && (
              <motion.div
                className="album-cover"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <img 
                  key={`cover-${currentSlide}`}
                  src={`/api/proxy-image?url=${encodeURIComponent(slides[currentSlide].cover)}`} 
                  alt="Album Cover" 
                />
              </motion.div>
            )}
            
            {!slides[currentSlide].is_banner && (
              <motion.div
                className="slide-text"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="slide-artist">{slides[currentSlide].artist}</h2>
                <h1 className="slide-title">{slides[currentSlide].title}</h1>
                <p className="slide-subtitle">{slides[currentSlide].subtitle}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
        ‹
      </button>
      <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
        ›
      </button>

      {/* Dots Navigation */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
