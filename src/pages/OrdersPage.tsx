// src/pages/OrdersPage.tsx (Frontend)
import React, { useState, useEffect } from "react";
import { getOrders, cancelOrder as apiCancelOrder } from "../api/orderApi";
import { Order, OrderStatus } from "../types";
import { useAuth } from "../hooks/useAuth";
import { format } from "date-fns";
import styles from "./styles/OrdersPage.module.css";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Inisialisasi array kosong
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrders();
      // FIX: Cek response dan response.data sebelum akses
      if (response && response.data) {
        setOrders(response.data);
      } else {
        setOrders([]); // Default ke array kosong jika struktur tidak sesuai
        setError("Received invalid data for orders.");
      }
    } catch (err: any) {
      // Tangkap error spesifik jika perlu
      console.error("Failed to fetch orders:", err);
      setError(
        `Could not load your orders: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      setOrders([]); // Set ke array kosong jika terjadi error fetch
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Dependency array kosong sudah cukup jika tidak ada filter di sini

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await apiCancelOrder(orderId);
      fetchOrders(); // Refresh list
      alert("Order cancelled successfully.");
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "Could not cancel the order.");
    }
  };

  // --- JSX ---
  return (
    <div className="container">
      <h1 className={styles.title}>Your Orders</h1>
      {loading && <p>Loading orders...</p>}
      {/* Tampilkan error fetch utama */}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && (
        <>
          {/* Pengecekan orders.length sekarang aman */}
          {orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <div className={styles.orderList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  {/* ... isi order card ... */}
                  <div className={styles.orderHeader}>
                    <h3>Order #{order.id}</h3>
                    <span
                      className={`${styles.status} ${
                        styles[`status${order.status}`]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p>
                    <strong>Date:</strong>{" "}
                    {order.order_date
                      ? format(new Date(order.order_date), "Pp")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Total:</strong> $
                    {Number(order.total_price).toFixed(2)}
                  </p>
                  <div className={styles.orderDetails}>
                    <h4>Items:</h4>
                    {/* Tambah pengecekan untuk orderDetails sebelum map */}
                    {Array.isArray(order.orderDetails) &&
                    order.orderDetails.length > 0 ? (
                      <ul>
                        {order.orderDetails.map((detail) => (
                          <li key={detail.id || detail.menu_item_id}>
                            {detail.menuItem?.name ||
                              `Item ID: ${detail.menu_item_id}`}{" "}
                            - Qty: {detail.quantity} (@ $
                            {Number(detail.price_per_item).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: "0.9em", color: "grey" }}>
                        No item details available.
                      </p>
                    )}
                  </div>
                  {order.status === OrderStatus.PENDING && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className={`${styles.cancelButton} button button-danger`}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
