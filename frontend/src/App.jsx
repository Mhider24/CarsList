import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerInbox from "./pages/SellerInbox";
import EditListing from "./pages/EditListing";
import SellerPage from "./pages/SellerPage";
import CreateListing from "./pages/CreateListing";
import FavoritePage from "./pages/FavoritePage";
import ListingDetails from "./pages/ListingDetails";
import "./App.css";

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
          CarsList
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          Home
        </Link>
        {user?.role === "seller" && (
          <>
            <Link to="/seller-dashboard" style={{ textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link to="/seller-inbox" style={{ textDecoration: "none" }}>
              Inbox
            </Link>
            <Link to="/create-listing" style={{ textDecoration: "none" }}>
              Create Listing
            </Link>
          </>
        )}
        {user?.role === "buyer" && (
          <Link to="/favorites" style={{ textDecoration: "none" }}>
            Favorites
          </Link>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        {user ? (
          <>
            <span>
              {user.name} ({user.role})
            </span>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller-inbox" element={<SellerInbox />} />
        <Route path="/seller-dashboard" element={<SellerPage />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/favorites" element={<FavoritePage />} />
      </Routes>
    </Router>
  );
}

export default App;