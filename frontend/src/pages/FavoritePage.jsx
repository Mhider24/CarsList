import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FavoritePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadFavorites() {
    if (!user || user.role !== "buyer") {
      setMessage("Please log in as a buyer to view favorites.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/CarsList/backend/api/favorites/index.php?user_id=${user.id}`
      );
      const data = await response.json();

      setFavorites(data.favorites || []);
    } catch (error) {
      setMessage("Could not load favorites.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function handleRemove(listingId) {
    try {
      const response = await fetch("/CarsList/backend/api/favorites/remove.php", {
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

      if (data.success) {
        setFavorites((prev) => prev.filter((item) => item.id !== listingId));
      } else {
        alert(data.message || "Could not remove favorite.");
      }
    } catch (error) {
      alert("Server error while removing favorite.");
    }
  }

  if (!user || user.role !== "buyer") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Favorites</h1>
        <p>Please log in as a buyer first.</p>
        <button className="btn" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Favorite Cars</h1>

      {loading && <p>Loading favorites...</p>}
      {message && <p>{message}</p>}

      {!loading && favorites.length === 0 && <p>No favorites saved yet.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {favorites.map((car) => (
          <div
            key={car.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={car.image_url || "https://via.placeholder.com/300x180?text=No+Image"}
              alt={`${car.year} ${car.make} ${car.model}`}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <h2>
              {car.year} {car.make} {car.model}
            </h2>
            <p>${Number(car.price).toLocaleString()}</p>
            <p>{Number(car.mileage).toLocaleString()} miles</p>

            <button className="btn" onClick={() => handleRemove(car.id)}>
              Remove Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritePage;