import { useEffect, useState } from "react";
import Listings from "./Listings";

function Home() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    try {
      const response = await fetch("/CarsList/backend/api/listings/index.php");
      const data = await response.json();

      if (Array.isArray(data)) {
        setListings(data);
      } else if (Array.isArray(data.listings)) {
        setListings(data.listings);
      } else {
        setListings([]);
        setMessage("No listings found.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage(`Error loading vehicles: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleFavoriteToggle(listingId, isFavorite) {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || user.role !== "buyer") {
      alert("Please log in as a buyer first.");
      return;
    }

    const url = isFavorite
      ? "/CarsList/backend/api/favorites/remove.php"
      : "/CarsList/backend/api/favorites/add.php";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          listing_id: listingId,
        }),
      });

      const data = await response.json();
      alert(data.message || "Favorite updated.");
    } catch (error) {
      alert("Could not update favorite.");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Browse Listings</h1>

      {loading && <p>Loading vehicles...</p>}
      {message && <p>{message}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {listings.map((listing) => (
          <Listings
            key={listing.id}
            listing={listing}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;