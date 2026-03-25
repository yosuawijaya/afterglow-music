import { useState, useRef } from 'react'
import './ImageUploadManual.css'

interface ImageUploadManualProps {
  onUpload: (url: string) => void
  currentImage?: string
  label: string
}

const ImageUploadManual = ({ onUpload, currentImage, label }: ImageUploadManualProps) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(currentImage || '')
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setError('')

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type: ${file.type}. Please upload JPG, PNG, or WebP only.`)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Uploadcare
    setUploading(true)
    try {
      const publicKey = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY
      
      const formData = new FormData()
      formData.append('UPLOADCARE_PUB_KEY', publicKey)
      formData.append('UPLOADCARE_STORE', '1')
      formData.append('file', file)

      const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      // Force JPG conversion
      const cdnUrl = `https://ucarecdn.com/${data.file}/`
      const optimizedUrl = `${cdnUrl}-/format/jpeg/-/quality/smart/-/progressive/yes/`
      
      console.log('Uploaded as:', file.type)
      console.log('Original URL:', cdnUrl)
      console.log('Optimized URL:', optimizedUrl)
      
      onUpload(optimizedUrl)
      setError('')
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="image-upload-manual">
      <label className="upload-label">{label}</label>
      
      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          <button type="button" onClick={handleRemove} className="remove-btn">
            Remove
          </button>
        </div>
      )}

      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={uploading}
          className="file-input"
        />
        <div className="upload-text">
          {uploading ? (
            <span className="uploading">Uploading...</span>
          ) : (
            <>
              <span className="upload-icon">📁</span>
              <span>Click to select image</span>
              <small>JPG, PNG, or WebP only</small>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <small className="upload-hint">
        💡 Tip: Make sure your file is JPG, PNG, or WebP format before uploading
      </small>
    </div>
  )
}

export default ImageUploadManual
