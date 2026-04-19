import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  

    const currentUserId = 1;

  //Fetch favorites
  useEffect(() => {
    fetch(`http://localhost/CarsList/backend/api/favorites/read.php?user_id=${currentUserId}`)
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error("Error loading favorites:", error));
  }, []);

  //Remove a favorite
  const removeFavorite = (listingId) => {
    fetch("http://localhost/CarsList/backend/api/favorites/remove.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        user_id: currentUserId, 
        listing_id: listingId 
      }),
    })
      .then(() => {
        setFavorites(favorites.filter((car) => car.id !== listingId));
      })
      .catch((error) => console.error("Error removing favorite:", error));
  };

  return (
    <div className="favorites-page">
      <h1>My Favorite Vehicles</h1>
      
      {favorites.length === 0 ? (
        <p>No favorite's yet!</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((car) => (
            <article key={car.id} className="listing-card">
              <h2>{car.make} {car.model}</h2>
              <p>Mileage: {car.mileage}</p>
              <p>${car.price}</p>
              
              <div className="button-group">
                <Link to={`/listing/${car.id}`} className="btn">
                  View Details
                </Link>
                <button onClick={() => removeFavorite(car.id)} className="btn">
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;