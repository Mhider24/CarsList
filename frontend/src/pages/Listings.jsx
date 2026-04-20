import { Link } from "react-router-dom";

function Listings({ listing, onFavoriteToggle, isFavorite = false }) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user || user.role !== "buyer") {
      alert("Please log in as a buyer to manage favorites.");
      return;
    }

    onFavoriteToggle(listing.id, isFavorite);
  }

  return (
    <div
      className="listing-card"
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "16px",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={listing.image_url || "https://via.placeholder.com/300x180?text=No+Image"}
        alt={`${listing.year} ${listing.make} ${listing.model}`}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <div className="card-info">
        <h2>
          {listing.year} {listing.make} {listing.model}
        </h2>
        <p>
          <strong>Price:</strong> ${Number(listing.price).toLocaleString()}
        </p>
        <p>
          <strong>Mileage:</strong> {Number(listing.mileage).toLocaleString()} miles
        </p>
        <p>
          <strong>Title:</strong> {listing.title_status}
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
        <Link to={`/listing/${listing.id}`}>
          <button className="btn">View Details</button>
        </Link>

        {user?.role === "buyer" && (
          <button className="btn" onClick={handleFavoriteClick}>
            {isFavorite ? "Remove Favorite" : "Add Favorite"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Listings;