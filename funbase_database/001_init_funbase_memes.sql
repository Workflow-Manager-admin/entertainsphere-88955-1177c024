-- Migration: Initial FunBase memes, likes, saves, and users setup
-- This script assumes MySQL ≥5.7 for proper foreign key handling and relational integrity.

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(40) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MEMES TABLE
CREATE TABLE IF NOT EXISTS memes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    caption VARCHAR(512),
    tags VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MEME_LIKES TABLE
CREATE TABLE IF NOT EXISTS meme_likes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    meme_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UNIQUE (meme_id, user_id),
    FOREIGN KEY (meme_id) REFERENCES memes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MEME_SAVES TABLE
CREATE TABLE IF NOT EXISTS meme_saves (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    meme_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UNIQUE (meme_id, user_id),
    FOREIGN KEY (meme_id) REFERENCES memes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_memes_user_id ON memes(user_id);
CREATE INDEX IF NOT EXISTS idx_meme_likes_meme_id ON meme_likes(meme_id);
CREATE INDEX IF NOT EXISTS idx_meme_likes_user_id ON meme_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_meme_saves_meme_id ON meme_saves(meme_id);
CREATE INDEX IF NOT EXISTS idx_meme_saves_user_id ON meme_saves(user_id);
