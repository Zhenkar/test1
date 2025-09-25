import React, { useEffect, useState } from "react";
import Navb from "./Navb";
import homeBanner from '../assets/homeBanner.jpg';
import Foodcard from "./Foodcard";
import AdminNav from "./AdminNav";

export default function Home() {
  const [artworks, setArtworks] = useState([]); // State to store artworks
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to handle errors
  const [artworkCount, setArtworkCount] = useState(0); // State to store the artwork count
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    // Fetch artworks from the API
    const fetchArtworks = async () => {
      try {
        const response = await fetch("/api/artworks");
        if (!response.ok) {
          throw new Error("Failed to fetch artworks");
        }
        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch artwork count
    const fetchArtworkCount = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/artworks/count");
        if (!response.ok) {
          throw new Error("Failed to fetch artwork count");
        }
        const data = await response.json();
        setArtworkCount(data.total_artworks); // Set the artwork count
      } catch (err) {
        console.error("Error fetching artwork count:", err);
        setError(err.message);
      }
    };

    // Fetch both artworks and artwork count on component mount
    fetchArtworks();
    fetchArtworkCount();
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <>
      {
        (userType === "artist") ? <AdminNav /> : <Navb />
      }
      <div className="max-w-[1240px] mx-auto px-4 -z-50">
        <div className="max-h-[500px] relative px-4">
          <div>
            <img
              src={homeBanner}
              alt="Banner"
              className="brightness-90 rounded-xl w-full h-full object-cover -z-50 md:h-[400px]"
            />
          </div>
          <div className="absolute top-0 w-full h-full flex flex-col justify-center px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Welcome to<span className="text-red-600"> Art Gallery</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-between my-5">
          <h1 className="text-4xl font-semibold">Artworks</h1>
          <p className="text-2xl font-semibold text-gray-600">{loading ? "Loading..." : `${artworkCount} Artworks`}</p>
        </div>

        <div className="px-4 py-10 grid grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 justify-items-center">
          {loading && <p>Loading artworks...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && artworks.length === 0 && <p>No artwork posted.</p>}
          {!loading &&
            artworks.map((artwork) => (
              <Foodcard
                key={artwork.artwork_id}
                image={`data:image/jpeg;base64,${artwork.artwork_image}`}
                title={artwork.artwork_name}
                price={artwork.price}
                size="200x200"
                about={artwork.about_artwork}
                id={artwork.artwork_id}
              />
            ))}
        </div>
      </div>
    </>
  );
}
