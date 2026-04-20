import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    color: "",
    title_status: "",
    transmission: "",
    fuel_type: "",
    description: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage("");

    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const response = await fetch("/CarsList/backend/api/uploads/image_upload.php", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image_url: data.image_url,
        }));
      } else {
        setMessage(data.message || "Could not upload image.");
      }
    } catch (error) {
      setMessage("Server error while uploading image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function loadListing() {
    if (!user || user.role !== "seller") {
      setMessage("You must be logged in as a seller.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/CarsList/backend/api/listings/show.php?id=${id}`);
      const data = await response.json();

      if (!data || !data.id) {
        setMessage("Listing not found.");
        setLoading(false);
        return;
      }

      if (Number(data.seller_id) !== Number(user.id)) {
        setMessage("You are not allowed to edit this listing.");
        setLoading(false);
        return;
      }

      setFormData({
        make: data.make || "",
        model: data.model || "",
        year: data.year || "",
        price: data.price || "",
        mileage: data.mileage || "",
        color: data.color || "",
        title_status: data.title_status || "",
        transmission: data.transmission || "",
        fuel_type: data.fuel_type || "",
        description: data.description || "",
        image_url: data.image_url || "",
      });
    } catch (error) {
      setMessage("Could not load listing.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListing();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user || user.role !== "seller") {
      setMessage("You must be logged in as a seller.");
      return;
    }

    const payload = {
      id: Number(id),
      seller_id: user.id,
      make: formData.make,
      model: formData.model,
      year: Number(formData.year),
      price: Number(formData.price),
      mileage: Number(formData.mileage),
      color: formData.color,
      title_status: formData.title_status,
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,
      description: formData.description,
      image_url: formData.image_url,
    };

    try {
      const response = await fetch("/CarsList/backend/api/listings/update.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert("Listing updated successfully.");
        navigate("/seller-dashboard");
      } else {
        setMessage(data.message || "Could not update listing.");
      }
    } catch (error) {
      setMessage("Server error while updating listing.");
    }
  }

  if (!user || user.role !== "seller") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Edit Listing</h1>
        <p>Please log in as a seller first.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Edit Listing</h1>
        <p>Loading listing...</p>
      </div>
    );
  }

  return (
    <div className="create-listing-page">
      <h1>Edit Listing</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input name="make" placeholder="Make" value={formData.make} onChange={handleChange} required />
        <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
        <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input name="mileage" type="number" placeholder="Mileage" value={formData.mileage} onChange={handleChange} required />
        <input name="color" placeholder="Color" value={formData.color} onChange={handleChange} required />
        <input name="title_status" placeholder="Title Status" value={formData.title_status} onChange={handleChange} required />
        <input name="transmission" placeholder="Transmission" value={formData.transmission} onChange={handleChange} required />
        <input name="fuel_type" placeholder="Fuel Type" value={formData.fuel_type} onChange={handleChange} required />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />

        <input
          name="image_url"
          placeholder="Paste direct image URL"
          value={formData.image_url}
          onChange={handleChange}
        />

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Or choose image from device
          </label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploadingImage && <p style={{ marginTop: "8px" }}>Uploading image...</p>}
        </div>

        {formData.image_url && (
          <div style={{ marginTop: "10px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>Image Preview</p>
            <img
              src={formData.image_url}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        <button type="submit" className="btn">
          Save Changes
        </button>
      </form>

      {message && <p style={{ marginTop: "12px" }}>{message}</p>}
    </div>
  );
}

export default EditListing;