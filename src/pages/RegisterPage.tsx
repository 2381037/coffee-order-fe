import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser as apiRegister } from "../api/authApi";
import styles from "./styles/AuthForm.module.css"; // Gunakan CSS Module yang sama

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      // Sesuaikan dengan validasi backend
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await apiRegister({ name, email, password });
      setSuccess("Registration successful! Please log in.");
      // Optional: Otomatis redirect ke login setelah beberapa detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.authContainer}`}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>Register</h2>
        {error && (
          <p className={`alert alert-danger ${styles.errorMessage}`}>{error}</p>
        )}
        {success && (
          <p className={`alert alert-success ${styles.successMessage}`}>
            {success}
          </p>
        )}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
            disabled={loading}
          />
        </div>
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
          <label htmlFor="password">Password (min. 8 chars)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="form-control"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="form-control"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="button button-primary"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className={styles.switchForm}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
