import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { releasesAPI, Release } from '../services/api'
import './Releases.css'

const Releases = () => {
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReleases()
  }, [])

  const loadReleases = async () => {
    try {
      const data = await releasesAPI.getAll()
      console.log('Releases loaded:', data)
      setReleases(data)
    } catch (error) {
      console.error('Failed to load releases:', error)
      setReleases([])
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return <section id="releases" className="releases" />
  }

  if (releases.length === 0) {
    return (
      <section id="releases" className="releases">
        <div className="releases-container">
          <div className="section-header-releases">
            <h2 className="section-title">LATEST RELEASES</h2>
            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
              No releases yet. Add releases from admin dashboard.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="releases" className="releases">
      <div className="releases-container">
        <motion.div
          className="section-header-releases"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">LATEST RELEASES</h2>
        </motion.div>

        <div className="releases-carousel-wrapper">
          <button className="carousel-arrow carousel-arrow-left" onClick={() => scroll('left')}>
            ‹
          </button>
          
          <div className="releases-carousel" ref={scrollContainerRef}>
            {releases.map((release, index) => (
              <motion.div
                key={release.id}
                className="release-card"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="release-artwork">
                  <img src={release.artwork} alt={release.title} />
                  <div className="release-overlay">
                    <div className="overlay-content">
                      <h3 className="overlay-artist">{release.artist}</h3>
                      <h2 className="overlay-title">{release.title}</h2>
                      <button 
                        className="listen-overlay-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(release.listenUrl, '_blank')
                        }}
                      >
                        Listen
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="carousel-arrow carousel-arrow-right" onClick={() => scroll('right')}>
            ›
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedRelease && (
          <motion.div
            className="release-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRelease(null)}
          >
            <motion.div
              className="release-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedRelease(null)}>
                ×
              </button>
              <img src={selectedRelease.artwork} alt={selectedRelease.title} className="modal-artwork" />
              <div className="modal-info">
                <h3 className="modal-artist">{selectedRelease.artist}</h3>
                <h2 className="modal-title">{selectedRelease.title}</h2>
                <a
                  href={selectedRelease.listenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="listen-btn"
                >
                  LISTEN
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Releases
