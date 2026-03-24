import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Music } from 'lucide-react'
import { submissionsAPI } from '../services/api'
import './Submit.css'

const Submit = () => {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      await submissionsAPI.create({
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        dateOfBirth: formData.get('dob') as string,
        placeOfBirth: formData.get('pob') as string,
        artistName: formData.get('artistName') as string,
        genre: formData.get('genre') as string,
        bio: formData.get('bio') as string,
        catalog: formData.get('catalog') as string || undefined,
        songTitle: formData.get('songTitle') as string,
        songLink: formData.get('songLink') as string,
        lyrics: formData.get('lyrics') as string || undefined,
        notes: formData.get('notes') as string || undefined,
      })
      
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="submit-page">
        <div className="submit-container">
          <motion.div
            className="success-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">✓</div>
            <h2>Submission Received!</h2>
            <p>Thank you for submitting your song. We'll review it and get back to you within 7-14 business days.</p>
            <a href="/" className="btn-primary">Back to Home</a>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="submit-page">
      <div className="submit-container">
        <motion.div
          className="submit-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a href="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </a>
          <h1 className="submit-title">Submit Your Song</h1>
          <p className="submit-subtitle">
            Join Afterglow Music family. Fill out the form below to submit your demo.
          </p>
        </motion.div>

        <motion.form
          className="submit-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-section">
            <h3 className="section-title">
              <Music size={20} />
              Personal Information
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+62 812 3456 7890"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Place of Birth *</label>
              <input
                type="text"
                name="pob"
                placeholder="Jakarta, Indonesia"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <Upload size={20} />
              Artist Information
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Artist Name / Stage Name *</label>
                <input
                  type="text"
                  name="artistName"
                  placeholder="Your artist name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Genre *</label>
                <input
                  type="text"
                  name="genre"
                  placeholder="Pop, Hip-Hop, Electronic, etc."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Artist Bio *</label>
              <textarea
                name="bio"
                rows={4}
                placeholder="Tell us about yourself and your music..."
                required
              />
            </div>

            <div className="form-group">
              <label>Previous Releases / Catalog</label>
              <textarea
                name="catalog"
                rows={3}
                placeholder="List your previous releases, streaming links, or portfolio (optional)"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <Music size={20} />
              Song Submission
            </h3>
            
            <div className="form-group">
              <label>Song Title *</label>
              <input
                type="text"
                name="songTitle"
                placeholder="Your song title"
                required
              />
            </div>

            <div className="form-group">
              <label>Song Link (Streaming/Download) *</label>
              <input
                type="url"
                name="songLink"
                placeholder="https://soundcloud.com/... or Google Drive link"
                required
              />
              <small>Upload your song to SoundCloud, Google Drive, Dropbox, or WeTransfer and paste the link here</small>
            </div>

            <div className="form-group">
              <label>Lyrics (if applicable)</label>
              <textarea
                name="lyrics"
                rows={6}
                placeholder="Paste your song lyrics here (optional)"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Anything else you'd like us to know? (optional)"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Your Song'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default Submit
