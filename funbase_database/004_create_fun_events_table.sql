-- Migration: Create fun_events table for "On This Fun Day" feature, plus example rows (FunBase)
-- Assumes MySQL 5.7+ (for JSON field support)

-- FUN_EVENTS TABLE
CREATE TABLE IF NOT EXISTS fun_events (
    id CHAR(36) PRIMARY KEY, -- UUID as text
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL, -- yyyy-mm-dd, for anniversary of event
    type VARCHAR(64) NOT NULL, -- 'fact', 'news', 'holiday', 'meme', etc.
    description TEXT,
    media_url VARCHAR(1024),
    source_url VARCHAR(1024),
    tags JSON, -- store as JSON array, e.g. ["holiday", "history"]
    safe BOOLEAN DEFAULT TRUE, -- if safe for all ages
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient date lookup
CREATE INDEX IF NOT EXISTS idx_fun_events_date ON fun_events(date);

-- Insert sample data
INSERT INTO fun_events (id, title, date, type, description, media_url, source_url, tags, safe)
VALUES
    (
        UUID(), -- generates a random UUID (MySQL 8+); replace with a static UUID for full MySQL 5.7 compatibility
        'Tetris was Released',
        '1984-06-06',
        'game',
        'Iconic puzzle video game Tetris was released on this day in 1984 in the Soviet Union.',
        'https://upload.wikimedia.org/wikipedia/en/7/7c/Tetris_Boxshot.JPG',
        'https://en.wikipedia.org/wiki/Tetris',
        '["video games", "history", "puzzle"]',
        TRUE
    ),
    (
        UUID(),
        'World Penguin Day',
        '2023-04-25',
        'holiday',
        'Celebrate the flightless, fabulous birds—penguins!—on World Penguin Day.',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://en.wikipedia.org/wiki/World_Penguin_Day',
        '["animals", "holiday", "fun fact"]',
        TRUE
    );

-- For backwards compatibility with older MySQL (no UUID()), use static UUIDs:
-- Replace UUID() in above insert with e.g., 'b1e7ea04-21ab-4a30-9875-aaa12345cde9'
