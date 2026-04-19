import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SellerPage() {
  const [myListings, setMyListings] = useState([]);
  
  //To check if they are logged in, we look for a user ID
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!currentUserId) return;

    fetch(`http://localhost/CarsList/backend/api/listings/read_seller.php?seller_id=${currentUserId}`)
      .then((response) => response.json())
      .then((data) => setMyListings(data))
      .catch((error) => console.error("Error fetching seller listings:", error));
  }, [currentUserId]);

  const handleDelete = (listingId) => {
    //Are you sure message
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    fetch("http://localhost/CarsList/backend/api/listings/delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: listingId, seller_id: currentUserId }),
    })
      .then(() => {
        //Instantly remove the car from the screen without a page refresh
        setMyListings(myListings.filter((car) => car.id !== listingId));
      })
      .catch((error) => console.error("Error deleting vehicle:", error));
  };

  const handleMarkSold = (listingId) => {
    fetch("http://localhost/CarsList/backend/api/listings/update_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: listingId, status: "Sold", seller_id: currentUserId }),
    })
      .then(() => {
        //Loop through the cars and update the status of just the one they clicked
        setMyListings(myListings.map(car => 
          car.id === listingId ? { ...car, title_status: "Sold" } : car
        ));
      })
      .catch((error) => console.error("Error marking as sold:", error));
  };

  //If they are not logged in, show this instead
  if (!currentUserId) {
    return (
      <div className="seller-page not-logged-in">
        <h2>You must be logged in to view your dashboard.</h2>
        <Link to="/login" className="btn">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="seller-page">
      <div className="seller-header">
        <h1>My Dashboard</h1>
        {/* The Create button lives right at the top of their dashboard */}
        <Link to="/create-listing" className="btn">+ Create New Listing</Link>
      </div>

      {myListings.length === 0 ? (
        <p>No active listings!</p>
      ) : (
        <div className="seller-grid">
          {myListings.map((car) => (
            <article key={car.id} className={`listing-card ${car.title_status === 'Sold' ? 'sold-card' : ''}`}>
              <h2>{car.make} {car.model}</h2>
              <p>Price: ${car.price}</p>
              <p>Status: {car.title_status}</p>
              
              <div className="seller-buttons">
                <Link to={`/edit-listing/${car.id}`} className="btn">Edit</Link>
                
                {/* Only show the "Mark Sold" button if it isn't already sold */}
                {car.title_status !== "Sold" && (
                  <button onClick={() => handleMarkSold(car.id)} className="btn">Mark Sold</button>
                )}
                <button onClick={() => handleDelete(car.id)} className="btn">Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerPage;