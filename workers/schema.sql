-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image TEXT NOT NULL,
  cover TEXT NOT NULL,
  is_banner INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Releases Table
CREATE TABLE IF NOT EXISTS releases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist TEXT NOT NULL,
  title TEXT NOT NULL,
  artwork TEXT NOT NULL,
  listen_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Artists Table
CREATE TABLE IF NOT EXISTS artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  place_of_birth TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  bio TEXT NOT NULL,
  catalog TEXT,
  song_title TEXT NOT NULL,
  song_link TEXT NOT NULL,
  lyrics TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO hero_slides (artist, title, subtitle, image, cover, order_index) VALUES
  ('ARUMA X SB19', 'MAPA (INDONESIAN VER.)', 'OUT NOW!', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', 1),
  ('NEON DREAMS', 'RETRO FUTURE', 'NEW SINGLE', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80', 2);

INSERT INTO releases (artist, title, artwork, listen_url, order_index) VALUES
  ('Luna Eclipse', 'Midnight Dreams', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80', 'https://spotify.com', 1),
  ('Neon Dreams', 'Retro Future', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80', 'https://spotify.com', 2),
  ('Phoenix Rising', 'Live Sessions', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80', 'https://spotify.com', 3),
  ('Stellar Waves', 'Cosmic Journey', 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&q=80', 'https://spotify.com', 4);

INSERT INTO artists (name, genre, description, order_index) VALUES
  ('Luna Eclipse', 'Ambient / Electronic', 'Visionary ambient producer crafting ethereal soundscapes.', 1),
  ('Neon Dreams', 'Synthwave / Pop', 'Multi-genre producer blending retro and modern sounds.', 2),
  ('Phoenix Rising', 'Hip-Hop / R&B', 'Dynamic artist pushing boundaries in urban music.', 3);

INSERT INTO settings (key, value) VALUES
  ('site_title', 'Afterglow Music'),
  ('primary_color', '#ff6b35'),
  ('instagram_url', 'https://instagram.com/afterglowmusic'),
  ('twitter_url', 'https://twitter.com/afterglowmusic'),
  ('facebook_url', 'https://facebook.com/afterglowmusic'),
  ('spotify_url', 'https://spotify.com/afterglowmusic');
