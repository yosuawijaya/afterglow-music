import './VerifiedBadge.css'

interface VerifiedBadgeProps {
  author?: string
  size?: number
}

const VerifiedBadge = ({ author = '', size = 16 }: VerifiedBadgeProps) => {
  // List of verified authors
  const verifiedAuthors = [
    'Afterglow Music',
    'afterglow music',
    'AFTERGLOW MUSIC'
  ]

  const isVerified = verifiedAuthors.some(
    verified => verified.toLowerCase() === author.toLowerCase()
  )

  if (!isVerified) return null

  return (
    <img 
      src="/assets/icons/verified.svg" 
      alt="Verified" 
      className="verified-badge"
      style={{ width: size, height: size }}
    />
  )
}

export default VerifiedBadge
