import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateListing from './pages/CreateListing';
import ListingDetails from './pages/Listings';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerPage';
import FavoritesPage from "./pages/FavoritePage";

function App() {
  return (
    <BrowserRouter>
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/favorites-page" element={<FavoritesPage />} />
          <Route path="/dashboard" element={<SellerPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
