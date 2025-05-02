import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import styles from "./Navbar.module.css"; // Buat file CSS Module

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect ke login setelah logout
  };

  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navbarContainer} container`}>
        <Link to="/" className={styles.logo}>
          ☕ CoffeeJoy {/* Ganti dengan logo/nama Anda */}
        </Link>
        <ul className={styles.navMenu}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/orders">Orders</Link>
            </li>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}

          <li className={styles.cartLink}>
            <Link to="/cart">
              Cart{" "}
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
