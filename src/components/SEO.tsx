import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  article?: boolean
  publishedTime?: string
  author?: string
  keywords?: string
}

const SEO = ({ 
  title = 'Afterglow Music - Independent Record Label Indonesia',
  description = 'Independent record label yang fokus pada pengembangan artis berbakat di Indonesia. Temukan musik terbaru, berita artis, dan submit demo Anda.',
  image = 'https://afterglow-music.pages.dev/og-image.jpg',
  article = false,
  publishedTime,
  author = 'Afterglow Music',
  keywords = 'afterglow music, record label indonesia, independent label, musik indonesia'
}: SEOProps) => {
  const location = useLocation()
  const url = `https://afterglow-music.pages.dev${location.pathname}`

  useEffect(() => {
    // Update title
    document.title = title

    // Update meta tags
    updateMetaTag('name', 'description', description)
    updateMetaTag('name', 'keywords', keywords)
    updateMetaTag('name', 'author', author)
    
    // Open Graph
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:image', image)
    updateMetaTag('property', 'og:url', url)
    updateMetaTag('property', 'og:type', article ? 'article' : 'website')
    
    if (article && publishedTime) {
      updateMetaTag('property', 'article:published_time', publishedTime)
      updateMetaTag('property', 'article:author', author)
    }
    
    // Twitter
    updateMetaTag('property', 'twitter:title', title)
    updateMetaTag('property', 'twitter:description', description)
    updateMetaTag('property', 'twitter:image', image)
    updateMetaTag('property', 'twitter:url', url)
    
    // Canonical URL
    updateCanonicalLink(url)
  }, [title, description, image, url, article, publishedTime, author, keywords])

  return null
}

function updateMetaTag(attr: string, key: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${key}"]`)
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]')
  
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  
  link.setAttribute('href', url)
}

export default SEO
