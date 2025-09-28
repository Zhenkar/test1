import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import ArtworkCard from "./ArtworkCard";

export const MyArtwork = () => {
    const [artworks, setArtworks] = useState(null); // State for artworks
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error
    const email = localStorage.getItem("email") || ""; // Get email from localStorage

    useEffect(() => {
        if (!email) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }

        const fetchArtworks = async () => {
            try {
                const response = await fetch(`/api/artworkss?email=${email}`); // Use email in query string
                if (!response.ok) {
                    throw new Error("Failed to fetch artworks.");
                }

                const data = await response.json();
                console.log(data);
                setArtworks(data.length > 0 ? data : []);
            } catch (err) {
                setError(err.name === "TypeError" ? "Network error. Check your connection." : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArtworks();
    }, [email]); // Runs when `email` changes

    const handleRemove = async (artworkId) => {
        try {
            const response = await fetch(`http://localhost:3000/artworks/${artworkId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete artwork.");
            }

            setArtworks((prevArtworks) => prevArtworks.filter((artwork) => artwork.artwork_id !== artworkId));
        } catch (err) {
            console.error("Error deleting artwork:", err);
            setError(err.message);
        }
    };

    // Function to convert binary data (Buffer) to Base64 string
    const cleanBase64 = (base64String) => {
        // Slice the string to remove the "base64:type251:" prefix
        const cleanString = base64String.slice(15); // Removes the first 15 characters ("base64:type251:")
        return cleanString;
    };

    return (
        <>
            <AdminNav />
            <div className="px-4 py-10 grid grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 justify-items-center">
                {loading && <p>Loading artworks...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && artworks && artworks.length === 0 && <p>No artwork posted.</p>}
                {!loading && !error && artworks &&
                    artworks.map((artwork) => (
                        <ArtworkCard
                            key={artwork.artwork_id}
                            id={artwork.artwork_id}
                            image={`data:image/jpeg;base64,${artwork.artwork_image}`}
                            title={artwork.artwork_name}
                            price={artwork.price}
                            onRemove={() => handleRemove(artwork.artwork_id)}
                        />
                    ))}
            </div>
        </>
    );
};
