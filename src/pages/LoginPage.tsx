import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser as apiLogin } from "../api/authApi"; // Rename import
import styles from "./styles/AuthForm.module.css"; // Buat file CSS Module ini

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil lokasi asal jika ada (dari PrivateRoute)
  const from = location.state?.from?.pathname || "/"; // Default ke home

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiLogin({ email, password });
      await login(response.access_token); // Panggil fungsi login dari context
      navigate(from, { replace: true }); // Kembali ke halaman asal atau home
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>Login</h2>
        {error && (
          <p className={`alert alert-danger ${styles.errorMessage}`}>{error}</p>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="button button-primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className={styles.switchForm}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
