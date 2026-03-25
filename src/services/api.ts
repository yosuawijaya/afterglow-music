// API Base URL - menggunakan environment variable untuk production, fallback ke proxy untuk development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Types
export interface HeroSlide {
  id: number;
  artist: string;
  title: string;
  subtitle: string;
  image: string;
  cover: string;
  is_banner?: boolean;
  order_index?: number;
}

export interface Release {
  id: number;
  artist: string;
  title: string;
  artwork: string;
  listenUrl: string;
  order_index?: number;
}

export interface Artist {
  id: number;
  name: string;
  genre: string;
  description: string;
  image?: string;
  order_index?: number;
}

export interface Settings {
  site_title?: string;
  primary_color?: string;
  instagram_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  spotify_url?: string;
}

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// ===== HERO SLIDES API =====
export const slidesAPI = {
  getAll: (): Promise<HeroSlide[]> => fetchAPI('/slides'),
  
  create: (slide: Omit<HeroSlide, 'id'>): Promise<HeroSlide> =>
    fetchAPI('/slides', {
      method: 'POST',
      body: JSON.stringify(slide),
    }),
  
  update: (id: number, slide: Partial<HeroSlide>): Promise<HeroSlide> =>
    fetchAPI(`/slides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(slide),
    }),
  
  delete: (id: number): Promise<{ message: string }> =>
    fetchAPI(`/slides/${id}`, {
      method: 'DELETE',
    }),
};

// ===== RELEASES API =====
export const releasesAPI = {
  getAll: (): Promise<Release[]> => fetchAPI('/releases'),
  
  create: (release: Omit<Release, 'id'>): Promise<Release> =>
    fetchAPI('/releases', {
      method: 'POST',
      body: JSON.stringify(release),
    }),
  
  update: (id: number, release: Partial<Release>): Promise<Release> =>
    fetchAPI(`/releases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(release),
    }),
  
  delete: (id: number): Promise<{ message: string }> =>
    fetchAPI(`/releases/${id}`, {
      method: 'DELETE',
    }),
};

// ===== ARTISTS API =====
export const artistsAPI = {
  getAll: (): Promise<Artist[]> => fetchAPI('/artists'),
  
  create: (artist: Omit<Artist, 'id'>): Promise<Artist> =>
    fetchAPI('/artists', {
      method: 'POST',
      body: JSON.stringify(artist),
    }),
  
  update: (id: number, artist: Partial<Artist>): Promise<Artist> =>
    fetchAPI(`/artists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(artist),
    }),
  
  delete: (id: number): Promise<{ message: string }> =>
    fetchAPI(`/artists/${id}`, {
      method: 'DELETE',
    }),
};

// ===== SETTINGS API =====
export const settingsAPI = {
  getAll: (): Promise<Settings> => fetchAPI('/settings'),
  
  update: (settings: Settings): Promise<{ message: string }> =>
    fetchAPI('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

// ===== IMAGE UPLOAD API =====
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, browser will set it with boundary
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },
};

// ===== SUBMISSION API =====
export interface Submission {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  artistName: string;
  genre: string;
  bio: string;
  catalog?: string;
  songTitle: string;
  songLink: string;
  lyrics?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export const submissionsAPI = {
  create: (submission: Omit<Submission, 'id' | 'createdAt'>): Promise<Submission> =>
    fetchAPI('/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    }),
  
  getAll: (): Promise<Submission[]> => fetchAPI('/submissions'),
  
  updateStatus: (id: number, status: string): Promise<{ message: string }> =>
    fetchAPI(`/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// ===== NEWS API =====
export interface News {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const newsAPI = {
  getAll: (showAll = false): Promise<News[]> => 
    fetchAPI(`/news${showAll ? '?all=true' : ''}`),
  
  getBySlug: (slug: string): Promise<News> => 
    fetchAPI(`/news/${slug}`),
  
  create: (news: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> =>
    fetchAPI('/news', {
      method: 'POST',
      body: JSON.stringify(news),
    }),
  
  update: (id: number, news: Partial<News>): Promise<News> =>
    fetchAPI(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(news),
    }),
  
  delete: (id: number): Promise<{ message: string }> =>
    fetchAPI(`/news/${id}`, {
      method: 'DELETE',
    }),
};
