import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/HomePage.module.css"; // Buat CSS Module

const HomePage: React.FC = () => {
  return (
    <div className={`container ${styles.homeContainer}`}>
      <header className={styles.hero}>
        <h1>Welcome to CoffeeJoy!</h1>
        <p>Your daily dose of happiness, brewed fresh.</p>
        {/* Inspirasi dari gambar: A Toxic Free Future -> A Perfect Brew Future? */}
        <h2>
          Create <span className={styles.highlight}>A Perfect Brew</span> Future
        </h2>
        <p className={styles.subtitle}>
          We exist because this fragile morning deserves a voice (and great
          coffee!).
        </p>
        <Link to="/menu" className="button button-primary">
          Start Your Order
        </Link>
      </header>

      <section className={styles.featured}>
        <h2>Featured Items</h2>
        {/* Tampilkan beberapa item menu unggulan di sini */}
        {/* Anda bisa fetch beberapa item dari API atau hardcode sementara */}
        <p className={styles.placeholder}>
          (Featured items component will go here)
        </p>
        {/* Contoh: <FeaturedItems /> */}
      </section>
    </div>
  );
};

export default HomePage;
