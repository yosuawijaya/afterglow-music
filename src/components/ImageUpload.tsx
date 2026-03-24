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
            onUpload(info.cdnUrl)
          }
        }}
        tabs="file url"
        previewStep={true}
        clearable={true}
        imagesOnly={true}
        locale="en"
      />
      <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
        Drag & drop image or click to browse
      </small>
    </div>
  )
}

export default ImageUpload
