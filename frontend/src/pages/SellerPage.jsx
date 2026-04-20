import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SellerPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [myListings, setMyListings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [message, setMessage] = useState("");

  async function loadSellerListings() {
    if (!user || user.role !== "seller") {
      setLoadingListings(false);
      return;
    }

    try {
      const response = await fetch("/CarsList/backend/api/listings/index.php");
      const data = await response.json();

      let allListings = [];

      if (Array.isArray(data)) {
        allListings = data;
      } else if (Array.isArray(data.listings)) {
        allListings = data.listings;
      }

      const filteredListings = allListings.filter((listing) => {
        if (listing.seller_id && Number(listing.seller_id) === Number(user.id)) {
          return true;
        }

        if (listing.seller_name && listing.seller_name === user.name) {
          return true;
        }

        return false;
      });

      setMyListings(filteredListings);
    } catch (error) {
      setMessage("Could not load your listings.");
    } finally {
      setLoadingListings(false);
    }
  }

  async function loadSellerOffers() {
    if (!user || user.role !== "seller") {
      setLoadingOffers(false);
      return;
    }

    try {
      const response = await fetch(
        `/CarsList/backend/api/offers/seller.php?seller_id=${user.id}`
      );
      const data = await response.json();

      if (data.offers && Array.isArray(data.offers)) {
        setOffers(data.offers);
      } else if (Array.isArray(data)) {
        setOffers(data);
      } else {
        setOffers([]);
      }
    } catch (error) {
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  }

  useEffect(() => {
    loadSellerListings();
    loadSellerOffers();
  }, []);

  async function handleDelete(listingId) {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      const response = await fetch("/CarsList/backend/api/listings/delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: listingId }),
      });

      const data = await response.json();

      if (data.success) {
        setMyListings((prev) => prev.filter((listing) => listing.id !== listingId));
      } else {
        alert(data.message || "Could not delete listing.");
      }
    } catch (error) {
      alert("Server error while deleting listing.");
    }
  }

  async function handleMarkSold(listingId) {
    try {
      const response = await fetch("/CarsList/backend/api/listings/mark_sold.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: listingId }),
      });

      const data = await response.json();

      if (data.success) {
        setMyListings((prev) =>
          prev.map((listing) =>
            listing.id === listingId
              ? { ...listing, status: "sold" }
              : listing
          )
        );
      } else {
        alert(data.message || "Could not mark listing as sold.");
      }
    } catch (error) {
      alert("Server error while marking sold.");
    }
  }

  if (!user || user.role !== "seller") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Seller Dashboard</h1>
        <p>You must be logged in as a seller to view this page.</p>
        <button className="btn" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        className="seller-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h1>My Seller Dashboard</h1>
        <Link to="/create-listing" className="btn">
          + Create Listing
        </Link>
      </div>

      {message && <p>{message}</p>}

      <section style={{ marginTop: "24px" }}>
        <h2>My Listings</h2>

        {loadingListings && <p>Loading your listings...</p>}

        {!loadingListings && myListings.length === 0 && (
          <p>You do not have any listings yet.</p>
        )}

        {!loadingListings && myListings.length > 0 && (
          <div
            className="seller-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "16px",
            }}
          >
            {myListings.map((listing) => (
              <article
                key={listing.id}
                className={`listing-card ${
                  listing.status === "sold" ? "sold-card" : ""
                }`}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "16px",
                  backgroundColor: "#fff",
                  opacity: listing.status === "sold" ? 0.7 : 1,
                }}
              >
                <img
                  src={
                    listing.image_url ||
                    "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  alt={`${listing.year} ${listing.make} ${listing.model}`}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                />

                <h2>
                  {listing.year} {listing.make} {listing.model}
                </h2>

                <p>
                  <strong>Price:</strong> ${Number(listing.price).toLocaleString()}
                </p>

                <p>
                  <strong>Mileage:</strong>{" "}
                  {Number(listing.mileage).toLocaleString()} miles
                </p>

                <p>
                  <strong>Status:</strong> {listing.status || listing.title_status}
                </p>

                <div
                  className="seller-buttons"
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "14px",
                  }}
                >
                  <Link to={`/listing/${listing.id}`}>
                    <button className="btn">View</button>
                  </Link>

                  <Link to={`/edit-listing/${listing.id}`}>
                    <button className="btn">Edit</button>
                  </Link>

                  {listing.status === "sold" && (
                    <button
                      className="btn"
                      onClick={() => handleMarkSold(listing.id)}
                    >
                      Mark Sold
                    </button>
                  )}

                  <button
                    className="btn"
                    onClick={() => handleDelete(listing.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: "36px" }}>
        <h2>Offers Received</h2>

        {loadingOffers && <p>Loading offers...</p>}

        {!loadingOffers && offers.length === 0 && (
          <p>You have not received any offers yet.</p>
        )}

        {!loadingOffers && offers.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {offers.map((offer) => (
              <article
                key={offer.offer_id || offer.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "16px",
                  backgroundColor: "#fff",
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>
                  {offer.year} {offer.make} {offer.model}
                </h3>

                <p>
                  <strong>Offer Amount:</strong> $
                  {Number(offer.amount).toLocaleString()}
                </p>

                <p>
                  <strong>Buyer:</strong> {offer.buyer_name || "Unknown buyer"}
                </p>

                {offer.buyer_email && (
                  <p>
                    <strong>Email:</strong> {offer.buyer_email}
                  </p>
                )}

                {offer.message && (
                  <p>
                    <strong>Message:</strong> {offer.message}
                  </p>
                )}

                {offer.status && (
                  <p>
                    <strong>Status:</strong> {offer.status}
                  </p>
                )}

                {offer.created_at && (
                  <p>
                    <strong>Submitted:</strong> {offer.created_at}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default SellerPage;