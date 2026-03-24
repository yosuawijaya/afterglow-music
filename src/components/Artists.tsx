import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { artistsAPI, Artist } from '../services/api'
import './Artists.css'

const Artists = () => {
  const ref = useRef(null)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArtists()
  }, [])

  const loadArtists = async () => {
    try {
      const data = await artistsAPI.getAll()
      console.log('Artists loaded:', data)
      setArtists(data)
    } catch (error) {
      console.error('Failed to load artists:', error)
      // Fallback empty array
      setArtists([])
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  if (loading) {
    return <section id="artists" className="artists" />
  }

  if (artists.length === 0) {
    return (
      <section id="artists" className="artists" ref={ref}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Artists</h2>
            <p className="section-subtitle">No artists yet. Add artists from admin dashboard.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="artists" className="artists" ref={ref}>
      <div className="container">
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Artists
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Meet the musical visionaries shaping the sound of Afterglow Music. From ambient to hip-hop, each artist brings a unique perspective.
          </motion.p>
        </div>

        <motion.div
          className="artists-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {artists.map((artist) => (
            <motion.div
              key={artist.id}
              className="artist-card"
              variants={cardVariants}
              whileHover={{ y: -15, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="artist-image">
                {artist.image ? (
                  <img src={artist.image} alt={artist.name} />
                ) : (
                  <span className="artist-icon">🎵</span>
                )}
              </div>
              <div className="artist-info">
                <p className="artist-number">({artist.id})</p>
                <h3 className="artist-name">{artist.name}</h3>
                <p className="artist-genre">{artist.genre}</p>
                <p className="artist-description">{artist.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Artists
