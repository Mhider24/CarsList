import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [offerData, setOfferData] = useState({
    amount: "",
    message: "",
  });

  async function loadListing() {
    try {
      const response = await fetch(`/CarsList/backend/api/listings/show.php?id=${id}`);
      const data = await response.json();

      console.log("show.php response:", data);

      if (data && typeof data === "object" && data.id) {
        setListing(data);
        setMessage("");
      } else {
        setMessage("Listing not found.");
      }
    } catch (error) {
      console.error("Listing details fetch error:", error);
      setMessage("Could not load listing.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListing();
  }, [id]);

  async function handleFavorite() {
    if (!user || user.role !== "buyer") {
      alert("Please log in as a buyer first.");
      return;
    }

    try {
      const response = await fetch("/CarsList/backend/api/favorites/add.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          listing_id: listing.id,
        }),
      });

      const data = await response.json();
      alert(data.message || "Added to favorites.");
    } catch (error) {
      alert("Could not add favorite.");
    }
  }

  async function handleOfferSubmit(e) {
    e.preventDefault();

    if (!user || user.role !== "buyer") {
      alert("Please log in as a buyer first.");
      return;
    }

    try {
      const response = await fetch("/CarsList/backend/api/offers/create.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: Number(listing.id),
          buyer_id: Number(user.id),
          amount: Number(offerData.amount),
          message: offerData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Offer submitted successfully.");
        setOfferData({
          amount: "",
          message: "",
        });
      } else {
        alert(data.message || "Could not submit offer.");
      }
    } catch (error) {
      console.error("Offer submit error:", error);
      alert("Server error while submitting offer.");
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      const response = await fetch("/CarsList/backend/api/listings/delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(listing.id) }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Listing deleted.");
        navigate("/seller-dashboard");
      } else {
        alert(data.message || "Could not delete listing.");
      }
    } catch (error) {
      alert("Server error while deleting listing.");
    }
  }

  async function handleMarkSold() {
    try {
      const response = await fetch("/CarsList/backend/api/listings/mark_sold.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(listing.id) }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Listing marked as sold.");
        loadListing();
      } else {
        alert(data.message || "Could not mark listing as sold.");
      }
    } catch (error) {
      alert("Server error while marking listing as sold.");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Listing Details</h1>
        <p>Loading listing...</p>
      </div>
    );
  }

  if (message) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Listing Details</h1>
        <p>{message}</p>
      </div>
    );
  }

  if (!listing) return null;

  const isOwner =
    user &&
    user.role === "seller" &&
    Number(user.id) === Number(listing.seller_id);

  const isSold = listing.status === "sold";

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <Link to="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "16px" }}>
        ← Back to Listings
      </Link>

      <img
        src={listing.image_url || "https://via.placeholder.com/700x400?text=No+Image"}
        alt={`${listing.year} ${listing.make} ${listing.model}`}
        style={{
          width: "100%",
          maxHeight: "420px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      />

      <h1>
        {listing.year} {listing.make} {listing.model}
      </h1>

      <p><strong>Price:</strong> ${Number(listing.price).toLocaleString()}</p>
      <p><strong>Mileage:</strong> {Number(listing.mileage).toLocaleString()} miles</p>
      <p><strong>Title Status:</strong> {listing.title_status || "N/A"}</p>
      <p><strong>Status:</strong> {listing.status || "N/A"}</p>
      <p><strong>Transmission:</strong> {listing.transmission || "N/A"}</p>
      <p><strong>Fuel Type:</strong> {listing.fuel_type || "N/A"}</p>
      <p><strong>Color:</strong> {listing.color || "N/A"}</p>
      <p><strong>Description:</strong> {listing.description || "No description provided."}</p>

      {user?.role === "buyer" && !isSold && (
        <div style={{ marginTop: "24px" }}>
          <button className="btn" onClick={handleFavorite}>
            Add to Favorites
          </button>

          <form
            onSubmit={handleOfferSubmit}
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "450px",
            }}
          >
            <h2>Make an Offer</h2>

            <input
              type="number"
              placeholder="Offer amount"
              value={offerData.amount}
              onChange={(e) =>
                setOfferData({ ...offerData, amount: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Message"
              value={offerData.message}
              onChange={(e) =>
                setOfferData({ ...offerData, message: e.target.value })
              }
              rows="4"
              required
            />

            <button type="submit" className="btn">
              Submit Offer
            </button>
          </form>
        </div>
      )}

      {user?.role === "buyer" && isSold && (
        <p style={{ marginTop: "24px", fontWeight: "bold" }}>
          This vehicle has already been sold.
        </p>
      )}

      {isOwner && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
          <Link to={`/edit-listing/${listing.id}`}>
            <button className="btn">Edit Listing</button>
          </Link>

          {!isSold && (
            <button className="btn" onClick={handleMarkSold}>
              Mark Sold
            </button>
          )}

          <button className="btn" onClick={handleDelete}>
            Delete Listing
          </button>
        </div>
      )}
    </div>
  );
}

export default ListingDetails;