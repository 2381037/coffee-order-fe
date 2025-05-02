import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage"; // Akan dibuat
import RegisterPage from "./pages/RegisterPage"; // Akan dibuat
import OrdersPage from "./pages/OrdersPage"; // Akan dibuat
import ProfilePage from "./pages/ProfilePage"; // Akan dibuat
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage"; // Akan dibuat
import UserManagementPage from "./pages/Admin/UserManagementPage"; // Akan dibuat
import MenuManagementPage from "./pages/Admin/MenuManagementPage"; // Akan dibuat
import OrderManagementPage from "./pages/Admin/OrderManagementPage"; // Akan dibuat
import NotFoundPage from "./pages/NotFoundPage"; // Akan dibuat

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { UserRole } from "./types";

import "./styles/global.css"; // Impor style global

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rute dengan MainLayout (Navbar, dll.) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              {/* Rute Terproteksi */}
              <Route element={<PrivateRoute />}>
                <Route path="orders" element={<OrdersPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Rute Admin */}
              <Route element={<PrivateRoute allowedRoles={[UserRole.ADMIN]} />}>
                <Route path="admin" element={<AdminPage />}>
                  {/* Sub-rute admin bisa didefinisikan di sini atau di dalam AdminPage */}
                  <Route index element={<OrderManagementPage />} />{" "}
                  {/* Default admin page */}
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="menu-items" element={<MenuManagementPage />} />
                  <Route path="orders" element={<OrderManagementPage />} />
                </Route>
              </Route>

              {/* Rute Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
