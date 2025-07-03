-- Migration: Add Quotes Table and Seed Data for FunBase
-- Assumes MySQL 5.7+ for JSON/text column support

-- QUOTES TABLE
CREATE TABLE IF NOT EXISTS quotes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(128) NOT NULL,
    tags JSON, -- e.g. ["motivation", "funny"]
    safe BOOLEAN NOT NULL DEFAULT TRUE, -- family-friendly safety flag
    moderation_reviewed BOOLEAN NOT NULL DEFAULT FALSE, -- for moderation workflow
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data: at least 6 example quotes
INSERT INTO quotes (text, author, tags) VALUES
(
    "Life is what happens when you're busy making other plans.",
    "John Lennon",
    '["life", "philosophy", "motivation"]'
),
(
    "I'm not arguing, I'm just explaining why I'm right.",
    "Unknown",
    '["humor", "funny"]'
),
(
    "The only way to do great work is to love what you do.",
    "Steve Jobs",
    '["motivation", "work"]'
),
(
    "Why don’t scientists trust atoms? Because they make up everything.",
    "Science Joke",
    '["funny", "science"]'
),
(
    "Do or do not. There is no try.",
    "Yoda",
    '["starwars", "motivation", "movies"]'
),
(
    "The best way to predict the future is to invent it.",
    "Alan Kay",
    '["future", "motivation", "innovation"]'
);
