-- Clear all data from tables
DELETE FROM hero_slides;
DELETE FROM releases;
DELETE FROM artists;

-- Reset auto-increment counters
DELETE FROM sqlite_sequence WHERE name='hero_slides';
DELETE FROM sqlite_sequence WHERE name='releases';
DELETE FROM sqlite_sequence WHERE name='artists';
