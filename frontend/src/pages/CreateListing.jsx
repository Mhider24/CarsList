import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const navigate = useNavigate(); //automatic redirect
  
  //Single state object to hold all our form inputs cleanly
  const [formData, setFormData] = useState({
    //seller_id: 1,
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    title_status: "",
    transmission: "",
    fuel_type: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault(); //Stops the page from refreshing

    //Fetch "create.php" 
    fetch("http://localhost/CarsList/backend/api/listings/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        alert("Vehicle successfully added!"); 
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding vehicle:", error);
        alert("Failed to add vehicle. Check console for details.");
      });
  };

  return (
    <div className ="create-listing-page">
      <h1>Sell a Vehicle</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="text" name="make" placeholder="Make (e.g. Toyota)" 
          value={formData.make} onChange={handleChange} required 
        />
        
        <input 
          type="text" name="model" placeholder="Model (e.g. Corolla)" 
          value={formData.model} onChange={handleChange} required 
        />
        
        <input 
          type="number" name="year" placeholder="Year (e.g. 2015)" 
          value={formData.year} onChange={handleChange} required 
        />

        <input 
          type="number" name="price" placeholder="Price ($)" 
          value={formData.price} onChange={handleChange} required 
        />

        <input 
          type="text" name="title_status" placeholder="Title Status (e.g. Clean, Salvage)" 
          value={formData.title_status} onChange={handleChange} required 
        />

        <input 
          type="text" name="transmission" placeholder="Transmission (e.g. Automatic)" 
          value={formData.transmission} onChange={handleChange} required 
        />

        <input 
          type="number" name="mileage" placeholder="Mileage" 
          value={formData.mileage} onChange={handleChange} required 
        />
        
        <input 
          type="text" name="fuel_type" placeholder="Fuel Type (e.g. Gas, Electric)" 
          value={formData.fuel_type} onChange={handleChange} required 
        />
        
        <button type="submit" className="btn">
          Post Listing
        </button>
      </form>
    </div>
  );
}

export default CreateListing;