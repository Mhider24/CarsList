import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerInbox() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOffers() {
    if (!user || user.role !== "seller") {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/CarsList/backend/api/offers/seller.php?seller_id=${user.id}`
      );
      const data = await response.json();

      let offerList = [];

      if (data.offers && Array.isArray(data.offers)) {
        offerList = data.offers;
      } else if (Array.isArray(data)) {
        offerList = data;
      }

      offerList.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      setOffers(offerList);
    } catch (error) {
      setMessage("Could not load seller inbox.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOffers();
  }, []);

  if (!user || user.role !== "seller") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Seller Inbox</h1>
        <p>You must be logged in as a seller to view this page.</p>
        <button className="btn" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Seller Inbox</h1>
      <p style={{ marginBottom: "20px" }}>
        Incoming offers from buyers will appear here.
      </p>

      {loading && <p>Loading inbox...</p>}
      {message && <p>{message}</p>}

      {!loading && offers.length === 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>No offers yet</h2>
          <p>Your inbox is empty right now.</p>
        </div>
      )}

      {!loading && offers.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {offers.map((offer, index) => (
            <article
              key={offer.offer_id || offer.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "18px",
                backgroundColor: "#fff",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <h2 style={{ margin: 0 }}>
                    {offer.year} {offer.make} {offer.model}
                  </h2>
                  <p style={{ marginTop: "6px" }}>
                    Buyer: <strong>{offer.buyer_name || "Unknown buyer"}</strong>
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {index < 3 && (
                    <span
                      style={{
                        backgroundColor: "#8b0000",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      New
                    </span>
                  )}

                  <span
                    style={{
                      border: "1px solid #ddd",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      fontSize: "14px",
                    }}
                  >
                    {offer.status || "pending"}
                  </span>
                </div>
              </div>

              <p>
                <strong>Offer Amount:</strong> ${Number(offer.amount).toLocaleString()}
              </p>

              {offer.listing_price && (
                <p>
                  <strong>Listing Price:</strong> $
                  {Number(offer.listing_price).toLocaleString()}
                </p>
              )}

              {offer.buyer_email && (
                <p>
                  <strong>Buyer Email:</strong> {offer.buyer_email}
                </p>
              )}

              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <strong>Message:</strong>
                <p style={{ marginTop: "8px" }}>{offer.message || "No message provided."}</p>
              </div>

              {offer.created_at && (
                <p style={{ marginTop: "12px", fontSize: "14px", opacity: 0.8 }}>
                  Received: {offer.created_at}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerInbox;