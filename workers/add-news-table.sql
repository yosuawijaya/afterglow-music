-- Add News Table
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'Afterglow Music',
  published_at DATETIME,
  is_published INTEGER DEFAULT 1,
  release_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE SET NULL
);

-- Add sample news
INSERT INTO news (title, slug, excerpt, content, cover_image, author, published_at, is_published) VALUES
  (
    'Luna Eclipse - Midnight Dreams Out Now!',
    'luna-eclipse-midnight-dreams-out-now',
    'Check out the latest release from Luna Eclipse: "Midnight Dreams". Available now on all streaming platforms!',
    '<p>We''re excited to announce the release of <strong>"Midnight Dreams"</strong> by <strong>Luna Eclipse</strong>!</p><p>This latest track showcases Luna Eclipse''s unique sound and artistic vision. Listen now on your favorite streaming platform.</p>',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
    'Afterglow Music',
    datetime('now'),
    1
  ),
  (
    'Neon Dreams - Retro Future Out Now!',
    'neon-dreams-retro-future-out-now',
    'Check out the latest release from Neon Dreams: "Retro Future". Available now on all streaming platforms!',
    '<p>We''re excited to announce the release of <strong>"Retro Future"</strong> by <strong>Neon Dreams</strong>!</p><p>This latest track showcases Neon Dreams''s unique sound and artistic vision. Listen now on your favorite streaming platform.</p>',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80',
    'Afterglow Music',
    datetime('now', '-2 days'),
    1
  );
