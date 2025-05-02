import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
// import Footer from '../components/Footer/Footer'; // Jika ada Footer

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="page-container">
        {" "}
        {/* Class dari global.css */}
        <Outlet /> {/* Halaman spesifik akan dirender di sini */}
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
