import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";

interface PrivateRouteProps {
  allowedRoles?: UserRole[]; // Role mana saja yang diizinkan
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Tampilkan loading indicator saat status auth sedang dicek
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Jika tidak terautentikasi, redirect ke halaman login
    // Simpan lokasi asal agar bisa kembali setelah login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika route memerlukan role tertentu dan user tidak memilikinya
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Redirect ke halaman 'unauthorized' atau halaman utama
    return <Navigate to="/" replace />; // Atau ke halaman /unauthorized
  }

  // Jika terautentikasi dan (tidak ada role spesifik ATAU role user diizinkan)
  return <Outlet />; // Render komponen child (halaman yang diproteksi)
};

export default PrivateRoute;
