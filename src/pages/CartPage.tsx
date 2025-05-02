// src/pages/CartPage.tsx
import React, { useState } from "react"; // <-- useState sudah ditambahkan
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createOrder } from "../api/orderApi";
import styles from "./styles/CartPage.module.css";
import { CreateOrderPayload } from "../types";

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // useState sekarang bisa digunakan
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleQuantityChange = (
    itemId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    setOrderError(null);

    const payload: CreateOrderPayload = {
      orderDetails: items.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      })),
    };

    try {
      await createOrder(payload);
      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err: any) {
      console.error("Failed to place order:", err);
      setOrderError(
        err.response?.data?.message ||
          "Could not place order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const total = getCartTotal();

  return (
    <div className="container">
      <h1 className={styles.title}>Your Cart</h1>
      {orderError && <p className="alert alert-danger">{orderError}</p>}
      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty.</p>
          <Link to="/menu" className="button button-primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {items.map((item) => (
              <div key={item.menuItem.id} className={styles.cartItem}>
                {item.menuItem.image_url && (
                  <img
                    src={item.menuItem.image_url}
                    alt={item.menuItem.name}
                    className={styles.itemImage}
                  />
                )}
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.menuItem.name}</span>
                  <span className={styles.itemPrice}>
                    ${item.menuItem.price.toFixed(2)}
                  </span>
                </div>
                <div className={styles.itemQuantity}>
                  <label htmlFor={`quantity-${item.menuItem.id}`}>Qty:</label>
                  <input
                    id={`quantity-${item.menuItem.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.menuItem.id, e)}
                    className={styles.quantityInput}
                  />
                </div>
                <span className={styles.itemSubtotal}>
                  Subtotal: ${(item.menuItem.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.menuItem.id)}
                  className={`${styles.removeButton} button button-danger`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <h2>Total: ${total.toFixed(2)}</h2>
            <div className={styles.cartActions}>
              <button onClick={clearCart} className="button button-secondary">
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="button button-primary"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Placing Order..." : "Proceed to Checkout"}
              </button>
            </div>
            {!isAuthenticated && (
              <p className={styles.loginPrompt}>
                Please{" "}
                <Link to="/login" state={{ from: "/cart" }}>
                  login
                </Link>{" "}
                to checkout.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
