import { useState, useEffect } from "react";
import Listing from "../pages/Listings";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost/CarsList/backend/api/listings/index.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  //Waiting for the PHP server
  if (loading) return <div>Loading vehicles...</div>;
  
  //If the database connection fails
  if (error) return <div>Error loading vehicles: {error}</div>;

  return (
    <main className="home-page">
      <h1>Vehicles for Sale</h1>
      
      <section className="listings-grid">
        {listings.map((vehicle) => (
          <Listing key={vehicle.id} vehicleData={vehicle} />
        ))}
      </section>
    </main>
  );
}

export default Home;