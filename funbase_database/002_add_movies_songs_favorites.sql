-- Migration: Add Movies, Songs, and Favorites tables for FunBase (movie & song suggestions)
-- Assumes MySQL 5.7+ for foreign keys and JSON/text fields

-- MOVIES TABLE
CREATE TABLE IF NOT EXISTS movies (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    mood VARCHAR(64) NOT NULL, -- e.g. 'happy', 'sad', 'exciting', etc.
    genre VARCHAR(64), -- e.g. 'Comedy', 'Drama'
    poster_url VARCHAR(1024),
    year YEAR,
    rating DECIMAL(2,1), -- e.g. 8.2
    description TEXT,
    trailer_url VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SONGS TABLE
CREATE TABLE IF NOT EXISTS songs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(128) NOT NULL,
    genre VARCHAR(64),
    mood VARCHAR(64),
    year YEAR,
    link_url VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAVORITES TABLE: for storing favorite movies/songs/memes/etc (generic by type)
-- item_type: ENUM('meme', 'movie', 'song', ...) -- flexible for extensibility
CREATE TABLE IF NOT EXISTS favorites (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    item_type ENUM('meme', 'movie', 'song') NOT NULL,
    item_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Safety: Only allow one favorite per user-item combination by type
    UNIQUE KEY unique_favorite (user_id, item_type, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- Due to polymorphic association, we use triggers or backend validation for item_id
    -- Example: For 'movie', item_id must exist in movies; for 'song', in songs; etc.
    -- Backend must enforce referential integrity for item_id per item_type
    INDEX idx_favorites_user (user_id)
);

-- Index for querying movies/songs by mood, genre
CREATE INDEX IF NOT EXISTS idx_movies_mood ON movies(mood);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_songs_mood ON songs(mood);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);

-- Rollback: (for migration tools that support DOWN)
-- DROP TABLE IF EXISTS favorites;
-- DROP TABLE IF EXISTS movies;
-- DROP TABLE IF EXISTS songs;
