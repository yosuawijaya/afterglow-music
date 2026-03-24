import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './Contact.css'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const socialLinks = [
    { name: 'Instagram', url: '#', icon: 'instagram.svg' },
    { name: 'Twitter', url: '#', icon: 'twitter.svg' },
    { name: 'Facebook', url: '#', icon: 'facebook.svg' },
    { name: 'Spotify', url: '#', icon: 'spotify.svg' }
  ]

  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="contact-text">
            We're always looking for exceptional new talent. If you're an artist 
            with a unique vision and passion for music, we'd love to hear from you.
          </p>
          <p className="contact-subtext">
            Submissions open for all genres. Let's create something extraordinary together.
          </p>
        </motion.div>

        <motion.div
          className="social-links"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              className="social-link"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={link.name}
            >
              <img 
                src={`/assets/icons/${link.icon}`} 
                alt={link.name}
                className="social-icon"
                onError={(e) => {
                  console.error('Icon failed to load:', link.icon)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="contact-cta"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.a
            href="/submit"
            className="cta-button"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Your Music
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
