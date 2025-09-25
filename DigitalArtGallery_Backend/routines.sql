-- routines.sql (no DELIMITER lines; these are full single-statement strings)
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

CREATE TRIGGER after_artwork_insert
AFTER INSERT ON Artworks
FOR EACH ROW
BEGIN
    UPDATE ArtworkSummary
    SET total_artworks = (SELECT COUNT(*) FROM Artworks)
    WHERE id = 1;
END;

CREATE TRIGGER after_artwork_delete
AFTER DELETE ON Artworks
FOR EACH ROW
BEGIN
    UPDATE ArtworkSummary
    SET total_artworks = (SELECT COUNT(*) FROM Artworks)
    WHERE id = 1;
END;
