import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Film, Disc, Users, FileText, Settings, ArrowLeft, LogOut, Newspaper } from 'lucide-react'
import { slidesAPI, releasesAPI, artistsAPI, newsAPI, HeroSlide, Release, Artist, News } from '../services/api'
import ImageUpload from '../components/ImageUpload'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './Admin.css'

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'slides' | 'releases' | 'artists' | 'news' | 'content' | 'settings'>('slides')
  const [artists, setArtists] = useState<Artist[]>([])
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [releases, setReleases] = useState<Release[]>([])
  const [news, setNews] = useState<News[]>([])
  
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [editingRelease, setEditingRelease] = useState<Release | null>(null)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showSlideForm, setShowSlideForm] = useState(false)
  const [showReleaseForm, setShowReleaseForm] = useState(false)
  const [showNewsForm, setShowNewsForm] = useState(false)
  
  // Image URLs for forms
  const [slideImageUrl, setSlideImageUrl] = useState('')
  const [slideCoverUrl, setSlideCoverUrl] = useState('')
  const [releaseArtworkUrl, setReleaseArtworkUrl] = useState('')
  const [artistImageUrl, setArtistImageUrl] = useState('')
  const [newsCoverUrl, setNewsCoverUrl] = useState('')
  
  // Rich text editor content
  const [newsContent, setNewsContent] = useState('')

  // Load data on mount
  useEffect(() => {
    if (activeTab === 'slides') loadSlides()
    if (activeTab === 'releases') loadReleases()
    if (activeTab === 'artists') loadArtists()
    if (activeTab === 'news') loadNews()
  }, [activeTab])

  // Load functions
  const loadSlides = async () => {
    try {
      const data = await slidesAPI.getAll()
      setSlides(data)
    } catch (error) {
      console.error('Failed to load slides:', error)
      alert('Failed to load slides. Using local data.')
    }
  }

  const loadReleases = async () => {
    try {
      const data = await releasesAPI.getAll()
      setReleases(data)
    } catch (error) {
      console.error('Failed to load releases:', error)
      alert('Failed to load releases. Using local data.')
    }
  }

  const loadArtists = async () => {
    try {
      const data = await artistsAPI.getAll()
      setArtists(data)
    } catch (error) {
      console.error('Failed to load artists:', error)
      alert('Failed to load artists. Using local data.')
    }
  }

  const loadNews = async () => {
    try {
      const data = await newsAPI.getAll(true) // Show all including unpublished
      setNews(data)
    } catch (error) {
      console.error('Failed to load news:', error)
      alert('Failed to load news.')
    }
  }

  const handleDeleteArtist = async (id: number) => {
    if (confirm('Are you sure you want to delete this artist?')) {
      try {
        await artistsAPI.delete(id)
        setArtists(artists.filter(a => a.id !== id))
      } catch (error) {
        console.error('Failed to delete artist:', error)
        alert('Failed to delete artist')
      }
    }
  }

  const handleEditArtist = (artist: Artist) => {
    setEditingArtist(artist)
    setArtistImageUrl(artist.image || '')
    setShowAddForm(true)
  }

  const handleSaveArtist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const artistData = {
      name: formData.get('name') as string,
      genre: formData.get('genre') as string,
      description: formData.get('description') as string,
      image: artistImageUrl || editingArtist?.image || ''
    }

    try {
      if (editingArtist) {
        const updated = await artistsAPI.update(editingArtist.id, artistData)
        setArtists(artists.map(a => a.id === editingArtist.id ? updated : a))
      } else {
        const created = await artistsAPI.create(artistData)
        setArtists([...artists, created])
      }
      setShowAddForm(false)
      setEditingArtist(null)
      setArtistImageUrl('')
    } catch (error) {
      console.error('Failed to save artist:', error)
      alert('Failed to save artist')
    }
  }

  const handleDeleteSlide = async (id: number) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        await slidesAPI.delete(id)
        setSlides(slides.filter(s => s.id !== id))
      } catch (error) {
        console.error('Failed to delete slide:', error)
        alert('Failed to delete slide')
      }
    }
  }

  const handleEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setSlideImageUrl(slide.image)
    setSlideCoverUrl(slide.cover)
    setShowSlideForm(true)
  }

  const handleSaveSlide = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const slideData = {
      artist: formData.get('artist') as string,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      image: slideImageUrl || editingSlide?.image || '',
      cover: slideCoverUrl || editingSlide?.cover || '',
      is_banner: formData.get('is_banner') === 'on'
    }

    console.log('Saving slide data:', slideData)

    // Validate required fields
    if (!slideData.image || !slideData.cover) {
      alert('Please upload both background image and album cover')
      return
    }

    try {
      if (editingSlide) {
        const updated = await slidesAPI.update(editingSlide.id, slideData)
        setSlides(slides.map(s => s.id === editingSlide.id ? updated : s))
        alert('Slide updated successfully!')
      } else {
        const created = await slidesAPI.create(slideData)
        setSlides([...slides, created])
        alert('Slide created successfully!')
      }
      setShowSlideForm(false)
      setEditingSlide(null)
      setSlideImageUrl('')
      setSlideCoverUrl('')
    } catch (error: any) {
      console.error('Failed to save slide:', error)
      alert(`Failed to save slide: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDeleteRelease = async (id: number) => {
    if (confirm('Are you sure you want to delete this release?')) {
      try {
        await releasesAPI.delete(id)
        setReleases(releases.filter(r => r.id !== id))
      } catch (error) {
        console.error('Failed to delete release:', error)
        alert('Failed to delete release')
      }
    }
  }

  const handleEditRelease = (release: Release) => {
    setEditingRelease(release)
    setReleaseArtworkUrl(release.artwork)
    setShowReleaseForm(true)
  }

  const handleSaveRelease = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const releaseData = {
      artist: formData.get('artist') as string,
      title: formData.get('title') as string,
      artwork: releaseArtworkUrl || editingRelease?.artwork || '',
      listenUrl: formData.get('listenUrl') as string,
      createNews: formData.get('createNews') === 'on'
    }

    try {
      if (editingRelease) {
        const updated = await releasesAPI.update(editingRelease.id, releaseData)
        setReleases(releases.map(r => r.id === editingRelease.id ? updated : r))
        alert('Release updated successfully!')
      } else {
        const created = await releasesAPI.create(releaseData)
        setReleases([...releases, created])
        if (releaseData.createNews) {
          alert('Release and news created successfully!')
        } else {
          alert('Release created successfully!')
        }
      }
      setShowReleaseForm(false)
      setEditingRelease(null)
      setReleaseArtworkUrl('')
    } catch (error) {
      console.error('Failed to save release:', error)
      alert('Failed to save release')
    }
  }

  // News handlers
  const handleDeleteNews = async (id: number) => {
    if (confirm('Are you sure you want to delete this news?')) {
      try {
        await newsAPI.delete(id)
        setNews(news.filter(n => n.id !== id))
      } catch (error) {
        console.error('Failed to delete news:', error)
        alert('Failed to delete news')
      }
    }
  }

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem)
    setNewsCoverUrl(newsItem.coverImage || '')
    setNewsContent(newsItem.content || '')
    setShowNewsForm(true)
  }

  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const slug = (formData.get('slug') as string) || 
      (formData.get('title') as string).toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    
    const newsData = {
      title: formData.get('title') as string,
      slug: slug,
      excerpt: formData.get('excerpt') as string,
      content: newsContent, // Use rich text editor content
      coverImage: newsCoverUrl || editingNews?.coverImage || '',
      author: formData.get('author') as string || 'Afterglow Music',
      isPublished: formData.get('isPublished') === 'on'
    }

    try {
      if (editingNews) {
        const updated = await newsAPI.update(editingNews.id!, newsData)
        setNews(news.map(n => n.id === editingNews.id ? updated : n))
        alert('News updated successfully!')
      } else {
        const created = await newsAPI.create(newsData)
        setNews([created, ...news])
        alert('News created successfully!')
      }
      setShowNewsForm(false)
      setEditingNews(null)
      setNewsCoverUrl('')
      setNewsContent('')
    } catch (error) {
      console.error('Failed to save news:', error)
      alert('Failed to save news')
    }
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">AFTERGLOW ADMIN</div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'slides' ? 'active' : ''}`}
            onClick={() => setActiveTab('slides')}
          >
            <Film className="nav-icon" size={20} />
            Hero Slides
          </button>
          <button
            className={`nav-item ${activeTab === 'releases' ? 'active' : ''}`}
            onClick={() => setActiveTab('releases')}
          >
            <Disc className="nav-icon" size={20} />
            Releases
          </button>
          <button
            className={`nav-item ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            <Users className="nav-icon" size={20} />
            Artists
          </button>
          <button
            className={`nav-item ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper className="nav-icon" size={20} />
            News
          </button>
          <button
            className={`nav-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText className="nav-icon" size={20} />
            Content
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="nav-icon" size={20} />
            Settings
          </button>
        </nav>
        <div className="admin-footer">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isAdminAuthenticated')
                window.location.href = '/login'
              }
            }}
            className="logout-button"
          >
            <LogOut size={16} />
            Logout
          </button>
          <a href="/" className="back-to-site">
            <ArrowLeft size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Back to Site
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">
            {activeTab === 'slides' && 'Manage Hero Slides'}
            {activeTab === 'releases' && 'Manage Releases'}
            {activeTab === 'artists' && 'Manage Artists'}
            {activeTab === 'news' && 'Manage News'}
            {activeTab === 'content' && 'Manage Content'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          {activeTab === 'slides' && (
            <button
              className="btn-primary"
              onClick={() => {
                setEditingSlide(null)
                setShowSlideForm(true)
              }}
            >
              + Add Slide
            </button>
          )}
          {activeTab === 'releases' && (
            <button
              className="btn-primary"
              onClick={() => {
                setEditingRelease(null)
                setShowReleaseForm(true)
              }}
            >
              + Add Release
            </button>
          )}
          {activeTab === 'artists' && (
            <button
              className="btn-primary"
              onClick={() => {
                setEditingArtist(null)
                setShowAddForm(true)
              }}
            >
              + Add Artist
            </button>
          )}
          {activeTab === 'news' && (
            <button
              className="btn-primary"
              onClick={() => {
                setEditingNews(null)
                setNewsContent('')
                setNewsCoverUrl('')
                setShowNewsForm(true)
              }}
            >
              + Add News
            </button>
          )}
        </header>

        <div className="admin-content">
          {activeTab === 'slides' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {showSlideForm && (
                <div className="modal-overlay" onClick={() => setShowSlideForm(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h2>
                    <form onSubmit={handleSaveSlide}>
                      <div className="form-group">
                        <label>Artist Name</label>
                        <input
                          type="text"
                          name="artist"
                          defaultValue={editingSlide?.artist}
                          placeholder="ARUMA X SB19"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          defaultValue={editingSlide?.title}
                          placeholder="MAPA (INDONESIAN VER.)"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Subtitle</label>
                        <input
                          type="text"
                          name="subtitle"
                          defaultValue={editingSlide?.subtitle}
                          placeholder="OUT NOW!"
                          required
                        />
                      </div>
                      
                      <ImageUpload
                        label="Background Image"
                        currentImage={slideImageUrl || editingSlide?.image}
                        onUpload={(url) => setSlideImageUrl(url)}
                      />
                      
                      <ImageUpload
                        label="Album Cover"
                        currentImage={slideCoverUrl || editingSlide?.cover}
                        onUpload={(url) => setSlideCoverUrl(url)}
                      />
                      
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="is_banner"
                            defaultChecked={editingSlide?.is_banner}
                            className="checkbox-input"
                          />
                          <span className="checkbox-custom"></span>
                          <span className="checkbox-text">
                            <strong>This is a banner</strong>
                            <small>Hide album cover and text overlay for pure image banner</small>
                          </span>
                        </label>
                      </div>
                      
                      <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowSlideForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="slides-grid">
                {slides.map((slide) => (
                  <div key={slide.id} className="slide-card">
                    <div className="slide-preview" style={{ backgroundImage: `url(${slide.image})` }}>
                      <div className="slide-overlay">
                        <img src={slide.cover} alt={slide.title} className="slide-cover" />
                      </div>
                    </div>
                    <div className="slide-info">
                      <h3>{slide.artist}</h3>
                      <h4>{slide.title}</h4>
                      <p>{slide.subtitle}</p>
                      <div className="slide-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditSlide(slide)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteSlide(slide.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'releases' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {showReleaseForm && (
                <div className="modal-overlay" onClick={() => setShowReleaseForm(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{editingRelease ? 'Edit Release' : 'Add New Release'}</h2>
                    <form onSubmit={handleSaveRelease}>
                      <div className="form-group">
                        <label>Artist Name</label>
                        <input
                          type="text"
                          name="artist"
                          defaultValue={editingRelease?.artist}
                          placeholder="Luna Eclipse"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Song/Album Title</label>
                        <input
                          type="text"
                          name="title"
                          defaultValue={editingRelease?.title}
                          placeholder="Midnight Dreams"
                          required
                        />
                      </div>
                      
                      <ImageUpload
                        label="Artwork"
                        currentImage={releaseArtworkUrl || editingRelease?.artwork}
                        onUpload={(url) => setReleaseArtworkUrl(url)}
                      />
                      
                      <div className="form-group">
                        <label>Listen URL (Spotify/Apple Music/etc)</label>
                        <input
                          type="url"
                          name="listenUrl"
                          defaultValue={editingRelease?.listenUrl}
                          placeholder="https://open.spotify.com/..."
                          required
                        />
                        <small>Link ke Spotify, Apple Music, YouTube, atau platform streaming lainnya</small>
                      </div>
                      
                      {!editingRelease && (
                        <div className="form-group checkbox-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              name="createNews"
                              defaultChecked={true}
                              className="checkbox-input"
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">
                              <strong>Auto-create News Article</strong>
                              <small>Automatically create a news post with this release cover as the featured image</small>
                            </span>
                          </label>
                        </div>
                      )}
                      
                      <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowReleaseForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="slides-grid">
                {releases.map((release) => (
                  <div key={release.id} className="slide-card">
                    <div className="slide-preview" style={{ backgroundImage: `url(${release.artwork})` }}>
                    </div>
                    <div className="slide-info">
                      <h3>{release.artist}</h3>
                      <h4>{release.title}</h4>
                      <p className="release-url">{release.listenUrl}</p>
                      <div className="slide-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditRelease(release)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteRelease(release.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'artists' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {showAddForm && (
                <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</h2>
                    <form onSubmit={handleSaveArtist}>
                      <div className="form-group">
                        <label>Artist Name</label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={editingArtist?.name}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Genre</label>
                        <input
                          type="text"
                          name="genre"
                          defaultValue={editingArtist?.genre}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          rows={4}
                          defaultValue={editingArtist?.description}
                          required
                        />
                      </div>
                      
                      <ImageUpload
                        label="Artist Photo (Optional)"
                        currentImage={artistImageUrl || editingArtist?.image}
                        onUpload={(url) => setArtistImageUrl(url)}
                      />
                      
                      <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="artists-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Genre</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artists.map((artist) => (
                      <tr key={artist.id}>
                        <td>{artist.id}</td>
                        <td className="artist-name">{artist.name}</td>
                        <td>{artist.genre}</td>
                        <td className="artist-desc">{artist.description.substring(0, 50)}...</td>
                        <td className="actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditArtist(artist)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteArtist(artist.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {showNewsForm && (
                <div className="modal-overlay" onClick={() => setShowNewsForm(false)}>
                  <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                    <h2>{editingNews ? 'Edit News' : 'Add New News'}</h2>
                    <form onSubmit={handleSaveNews}>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          defaultValue={editingNews?.title}
                          placeholder="Luna Eclipse - Midnight Dreams Out Now!"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Slug (URL-friendly)</label>
                        <input
                          type="text"
                          name="slug"
                          defaultValue={editingNews?.slug}
                          placeholder="luna-eclipse-midnight-dreams-out-now"
                        />
                        <small>Leave empty to auto-generate from title</small>
                      </div>
                      <div className="form-group">
                        <label>Excerpt (Short Description)</label>
                        <textarea
                          name="excerpt"
                          rows={3}
                          defaultValue={editingNews?.excerpt}
                          placeholder="Check out the latest release..."
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Content</label>
                        <ReactQuill 
                          theme="snow"
                          value={newsContent || editingNews?.content || ''}
                          onChange={setNewsContent}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link', 'blockquote'],
                              ['clean']
                            ]
                          }}
                          placeholder="Write your article content here..."
                        />
                      </div>
                      
                      <ImageUpload
                        label="Cover Image"
                        currentImage={newsCoverUrl || editingNews?.coverImage}
                        onUpload={(url) => setNewsCoverUrl(url)}
                      />
                      
                      <div className="form-group">
                        <label>Author</label>
                        <input
                          type="text"
                          name="author"
                          defaultValue={editingNews?.author || 'Afterglow Music'}
                          placeholder="Afterglow Music"
                        />
                      </div>
                      
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="isPublished"
                            defaultChecked={editingNews?.isPublished !== false}
                            className="checkbox-input"
                          />
                          <span className="checkbox-custom"></span>
                          <span className="checkbox-text">
                            <strong>Published</strong>
                            <small>Uncheck to save as draft</small>
                          </span>
                        </label>
                      </div>
                      
                      <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => {
                          setShowNewsForm(false)
                          setNewsContent('')
                        }}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="artists-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Published</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td className="artist-name">{item.title}</td>
                        <td>{item.slug}</td>
                        <td>{item.author}</td>
                        <td>
                          <span className={`status-badge ${item.isPublished ? 'published' : 'draft'}`}>
                            {item.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}</td>
                        <td className="actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditNews(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteNews(item.id!)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="content-section"
            >
              <div className="card">
                <h3>Hero Section</h3>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" defaultValue="AFTERGLOW MUSIC" />
                </div>
                <div className="form-group">
                  <label>Subtitle</label>
                  <input type="text" defaultValue="Independent Record Label" />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>

              <div className="card">
                <h3>About Section</h3>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={4} defaultValue="Afterglow Music is an independent record label..." />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>

              <div className="card">
                <h3>Contact Section</h3>
                <div className="form-group">
                  <label>Contact Text</label>
                  <textarea rows={3} defaultValue="We're always looking for exceptional new talent..." />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="settings-section"
            >
              <div className="card">
                <h3>Social Media Links</h3>
                <div className="form-group">
                  <label>Instagram URL</label>
                  <input type="url" placeholder="https://instagram.com/..." />
                </div>
                <div className="form-group">
                  <label>Twitter URL</label>
                  <input type="url" placeholder="https://twitter.com/..." />
                </div>
                <div className="form-group">
                  <label>Facebook URL</label>
                  <input type="url" placeholder="https://facebook.com/..." />
                </div>
                <div className="form-group">
                  <label>Spotify URL</label>
                  <input type="url" placeholder="https://spotify.com/..." />
                </div>
                <button className="btn-primary">Save Settings</button>
              </div>

              <div className="card">
                <h3>Site Settings</h3>
                <div className="form-group">
                  <label>Site Title</label>
                  <input type="text" defaultValue="Afterglow Music" />
                </div>
                <div className="form-group">
                  <label>Primary Color</label>
                  <input type="color" defaultValue="#ff6b35" />
                </div>
                <button className="btn-primary">Save Settings</button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Admin
