import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import styles from "./styles/AdminPage.module.css"; // Buat file CSS

const AdminPage: React.FC = () => {
  return (
    <div className={`container ${styles.adminContainer}`}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <nav className={styles.adminNav}>
        <ul>
          {/* Gunakan NavLink untuk styling link aktif */}
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              Order Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/menu-items"
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              Menu Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              User Management
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.adminContent}>
        <Outlet /> {/* Sub-halaman admin akan dirender di sini */}
      </div>
    </div>
  );
};

export default AdminPage;
