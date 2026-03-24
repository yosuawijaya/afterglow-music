import { motion } from 'framer-motion'
import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="loading-content">
        {/* Animated Circles */}
        <div className="loading-circles">
          <motion.div
            className="circle circle-1"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="circle circle-2"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />
          <motion.div
            className="circle circle-3"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
          />
        </div>

        {/* Rotating Bars */}
        <div className="loading-bars">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="bar"
              style={{ transform: `rotate(${i * 45}deg)` }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Center Logo */}
        <motion.div
          className="loading-logo"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="logo-inner"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            ✦
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
