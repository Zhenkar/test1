-- Create the database if not exists
-- CREATE DATABASE IF NOT EXISTS Digital_art_gallery;
USE Digital_art_gallery;

-- Registration table
CREATE TABLE IF NOT EXISTS registration (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) DEFAULT 'user'
);

-- Profile table
CREATE TABLE IF NOT EXISTS profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT,
    user_image LONGBLOB,
    phone_number VARCHAR(15),
    FOREIGN KEY (userid) REFERENCES registration(userid) ON DELETE CASCADE
);

-- Artworks table
CREATE TABLE IF NOT EXISTS Artworks (
    artwork_id INT AUTO_INCREMENT PRIMARY KEY,
    artwork_name VARCHAR(255) NOT NULL,
    artwork_image LONGBLOB,
    price DECIMAL(10, 2) NOT NULL,
    about_artwork TEXT,
    userid INT,
    FOREIGN KEY (userid) REFERENCES registration(userid) ON DELETE CASCADE
);

-- Artwork Summary table
CREATE TABLE IF NOT EXISTS ArtworkSummary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total_artworks INT DEFAULT 0
);

-- Function: GetArtworksByUserId
DROP FUNCTION IF EXISTS GetArtworksByUserId;
CREATE FUNCTION GetArtworksByUserId(user_id INT)
RETURNS JSON
DETERMINISTIC
BEGIN
    DECLARE artwork_json JSON;

    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'artwork_id', artwork_id,
            'artwork_name', artwork_name,
            'artwork_image', artwork_image,
            'price', price,
            'about_artwork', about_artwork,
            'user_id', userid
        )
    ) INTO artwork_json
    FROM Artworks
    WHERE userid = user_id;

    IF artwork_json IS NULL THEN
        SET artwork_json = JSON_ARRAY();
    END IF;

    RETURN artwork_json;
END;

-- Trigger: after artwork insert
DROP TRIGGER IF EXISTS after_artwork_insert;
CREATE TRIGGER after_artwork_insert
AFTER INSERT ON Artworks
FOR EACH ROW
BEGIN
    UPDATE ArtworkSummary
    SET total_artworks = (SELECT COUNT(*) FROM Artworks)
    WHERE id = 1;
END;

-- Trigger: after artwork delete
DROP TRIGGER IF EXISTS after_artwork_delete;
CREATE TRIGGER after_artwork_delete
AFTER DELETE ON Artworks
FOR EACH ROW
BEGIN
    UPDATE ArtworkSummary
    SET total_artworks = (SELECT COUNT(*) FROM Artworks)
    WHERE id = 1;
END;


