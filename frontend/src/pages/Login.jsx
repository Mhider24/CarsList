import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/CarsList/backend/api/auth/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage(data.message || "Login failed.");
        return;
      }

      const userData = data.user || {
        id: data.id ?? data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      if (!userData.id || !userData.role) {
        setMessage("Login worked, but user data was incomplete.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(userData));

      if (userData.role === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage("Could not connect to server.");
    }
  }

  return (
    <div className="auth-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Login
        </button>
      </form>

      {message && <p style={{ marginTop: "12px" }}>{message}</p>}

      <p style={{ marginTop: "14px" }}>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;