import { Link } from "react-router-dom";

function Listing ({ vehicleData }) {
    const { id, image, make, model, mileage, price } = vehicleData;

    const addFavorite = () => {
  fetch("http://localhost/CarsList/backend/api/favorites/add.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      //user_id: 1, DummyID
      listing_id: vehicleData.id 
    }),
  })
    .then(() => alert("Added to favorites!"))
    .catch((error) => console.error("Error adding favorite:", error));
};

  return (
    <article className="listing-card">
      {/* placeholder image */}
      <img 
        src={image || "https://via.placeholder.com/300x200?text=No+Vehicle+Image"} 
        alt={`${make} ${model}`} 
      />
      
      <div className="card-info">
        <h2>{make} {model}</h2>
        <p><strong>Mileage:</strong> {mileage}</p>
        <p className="price">${price}</p>
        
        {/* React Router's Link safely navigates to the details page without refreshing the browser */}
        <Link to={`/listing/${id}`}>
          <button>View Details</button>
          <button onClick={addFavorite} className="btn">Favorite</button>
        </Link>
      </div>
    </article>
  );
}

export default Listing;