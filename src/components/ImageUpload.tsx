import { Widget } from '@uploadcare/react-widget'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  label: string
}

const ImageUpload = ({ onUpload, currentImage, label }: ImageUploadProps) => {
  const publicKey = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY

  if (!publicKey || publicKey === 'your-public-key-here') {
    return (
      <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', marginBottom: '1rem' }}>
        <p style={{ margin: 0, color: '#856404' }}>
          ⚠️ Uploadcare not configured. Add VITE_UPLOADCARE_PUBLIC_KEY to .env
        </p>
      </div>
    )
  }

  return (
    <div className="image-upload">
      <label>{label}</label>
      {currentImage && (
        <div className="current-image">
          <img src={currentImage} alt="Current" style={{ maxWidth: '200px', marginBottom: '1rem', borderRadius: '8px' }} />
        </div>
      )}
      <Widget
        publicKey={publicKey}
        onChange={(info) => {
          if (info && info.cdnUrl) {
            // Force convert to JPG with optimization
            // This ensures ALL formats (including HEIC) become JPG
            const optimizedUrl = `${info.cdnUrl}-/format/jpeg/-/quality/smart/-/progressive/yes/`
            console.log('Original URL:', info.cdnUrl)
            console.log('Optimized URL:', optimizedUrl)
            onUpload(optimizedUrl)
          }
        }}
        tabs="file url"
        previewStep={true}
        clearable={true}
        imagesOnly={true}
        locale="en"
        imageShrink="1920x1920"
        inputAcceptTypes="image/jpeg,image/jpg,image/png,image/webp"
      />
      <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
        Upload JPG, PNG, or WebP. All images will be optimized automatically.
      </small>
      <small style={{ display: 'block', marginTop: '0.25rem', color: '#999', fontSize: '0.85em' }}>
        💡 Tip: If uploading from iPhone, convert HEIC to JPG first in Photos app (Share → Save as JPEG)
      </small>
    </div>
  )
}

export default ImageUpload
