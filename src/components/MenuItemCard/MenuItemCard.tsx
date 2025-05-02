import React from "react";
import { MenuItem } from "../../types";
import { useCart } from "../../hooks/useCart";
import styles from "./MenuItemCard.module.css";

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item, 1); // Tambahkan 1 item ke keranjang
  };

  return (
    <div className={styles.card}>
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className={styles.image} />
      ) : (
        <div className={styles.imagePlaceholder}>No Image</div> // Placeholder jika tidak ada gambar
      )}
      <div className={styles.content}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.description}>
          {item.description || "No description available."}
        </p>
        <div className={styles.footer}>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
          {item.is_available ? (
            <button
              onClick={handleAddToCart}
              className={`${styles.addButton} button button-primary`}
            >
              Add to Cart
            </button>
          ) : (
            <span className={styles.unavailable}>Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
