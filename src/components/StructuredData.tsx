import { useEffect } from 'react'

interface ArticleStructuredDataProps {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
}

export const ArticleStructuredData = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url
}: ArticleStructuredDataProps) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": title,
      "description": description,
      "image": image,
      "datePublished": datePublished,
      "dateModified": dateModified || datePublished,
      "author": {
        "@type": "Organization",
        "name": author,
        "url": "https://afterglow-music.pages.dev"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Afterglow Music",
        "logo": {
          "@type": "ImageObject",
          "url": "https://afterglow-music.pages.dev/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    })
    
    document.head.appendChild(script)
    
    return () => {
      document.head.removeChild(script)
    }
  }, [title, description, image, datePublished, dateModified, author, url])
  
  return null
}

export const OrganizationStructuredData = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Afterglow Music",
      "url": "https://afterglow-music.pages.dev",
      "logo": "https://afterglow-music.pages.dev/logo.png",
      "description": "Independent record label yang fokus pada pengembangan artis berbakat di Indonesia",
      "sameAs": [
        "https://instagram.com/afterglowmusic",
        "https://twitter.com/afterglowmusic",
        "https://facebook.com/afterglowmusic",
        "https://open.spotify.com/user/afterglowmusic"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "contact@afterglowmusic.com"
      }
    })
    
    document.head.appendChild(script)
    
    return () => {
      document.head.removeChild(script)
    }
  }, [])
  
  return null
}

export const MusicGroupStructuredData = ({ 
  name, 
  genre, 
  description, 
  image 
}: { 
  name: string
  genre: string
  description: string
  image?: string
}) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      "name": name,
      "genre": genre,
      "description": description,
      "image": image,
      "recordLabel": {
        "@type": "Organization",
        "name": "Afterglow Music"
      }
    })
    
    document.head.appendChild(script)
    
    return () => {
      document.head.removeChild(script)
    }
  }, [name, genre, description, image])
  
  return null
}
