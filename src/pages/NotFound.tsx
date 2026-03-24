import { motion } from 'framer-motion'
import { Home, Music, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="error-code"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="four">4</span>
            <motion.div
              className="vinyl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Music size={48} />
            </motion.div>
            <span className="four">4</span>
          </motion.div>

          <motion.h1
            className="error-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Page Not Found
          </motion.h1>

          <motion.p
            className="error-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Looks like this track doesn't exist in our playlist.
            <br />
            Let's get you back to the music.
          </motion.p>

          <motion.div
            className="error-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/" className="btn-home">
              <Home size={20} />
              Back to Home
            </Link>
            
            <Link to="/submit" className="btn-submit-link">
              <Music size={20} />
              Submit Your Song
            </Link>
          </motion.div>

          <motion.div
            className="error-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/#releases" className="error-link">Browse Releases</Link>
            <span className="separator">•</span>
            <Link to="/#artists" className="error-link">Our Artists</Link>
            <span className="separator">•</span>
            <Link to="/#contact" className="error-link">Contact Us</Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="floating-notes"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span className="note note-1">♪</span>
          <span className="note note-2">♫</span>
          <span className="note note-3">♪</span>
          <span className="note note-4">♫</span>
          <span className="note note-5">♪</span>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
