import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Section */}
        <div className="login-info">
          <h1>LeaveFlow</h1>

          <h2>Employee Leave Management System</h2>

          <p>
            Manage employee leaves, approvals and leave balances
            easily from one place.
          </p>

          <div className="info-points">
            <p>✓ Easy Leave Application</p>
            <p>✓ Manager Approval System</p>
            <p>✓ Leave Balance Tracking</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-card">
          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to your account
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="login-footer">
            LeaveFlow © 2026
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;