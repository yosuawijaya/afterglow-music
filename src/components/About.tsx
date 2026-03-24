import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './About.css'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="about" className="about" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">About Afterglow Music</h2>
          <p className="section-subtitle">Empowering artists and captivating global audiences</p>
        </motion.div>

        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="about-text">
            Afterglow Music is an independent record label dedicated to discovering and 
            developing the finest musical talent from around the world. We believe every 
            artist has a unique story worth sharing, and our mission is to provide a 
            platform to bring their creative vision to life.
          </p>
          <p className="about-text" style={{ marginTop: '1.5rem' }}>
            With a focus on innovation and quality, we've built a global community 
            connecting artists with millions of listeners across more than 50 countries.
          </p>
        </motion.div>

        <motion.div
          className="about-stats"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="stat-item">
            <motion.h3
              className="stat-number"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              500+
            </motion.h3>
            <p className="stat-label">Talented Artists</p>
          </div>
          <div className="stat-item">
            <motion.h3
              className="stat-number"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
            >
              25M+
            </motion.h3>
            <p className="stat-label">Monthly Streams</p>
          </div>
          <div className="stat-item">
            <motion.h3
              className="stat-number"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              150+
            </motion.h3>
            <p className="stat-label">Releases</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
