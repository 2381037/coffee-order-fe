// src/pages/OrdersPage.tsx (Frontend)
import React, { useState, useEffect } from "react";
import { getOrders, cancelOrder as apiCancelOrder } from "../api/orderApi";
import { Order, OrderStatus } from "../types";
import { useAuth } from "../hooks/useAuth"; // Keep useAuth if needed for other reasons (e.g., implicit auth check)
import { format } from "date-fns";
import styles from "./styles/OrdersPage.module.css";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const { user } = useAuth(); // REMOVED: 'user' was destructured but never used in this component.
  useAuth(); // Call useAuth if it might have side effects or trigger redirects, otherwise it can be removed if truly unused.

  // useCallback can be useful here if fetchOrders were passed as a prop,
  // but for simple useEffect dependency it's okay without it.
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrders();
      if (response && response.data) {
        // Filter out potential null/undefined orders if API might return them
        const validOrders = response.data.filter(
          (order): order is Order => !!order
        );
        setOrders(validOrders);
      } else {
        setOrders([]);
        setError("Received invalid data for orders.");
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(
        `Could not load your orders: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchOrders is stable if not using useCallback, but adding eslint-disable is clearer.

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await apiCancelOrder(orderId);
      fetchOrders(); // Refresh list after successful cancellation
      alert("Order cancelled successfully.");
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      alert(
        `Failed to cancel order: ${
          err.response?.data?.message || "Please try again."
        }`
      );
    }
  };

  // --- JSX ---
  return (
    <div className="container">
      <h1 className={styles.title}>Your Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <div className={styles.orderList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <h3>Order #{order.id}</h3>
                    {/* Add fallback for unexpected status values */}
                    <span
                      className={`${styles.status} ${
                        styles[`status${order.status}`] || styles.statusUNKNOWN
                      }`}
                      title={`Status: ${order.status}`}
                    >
                      {order.status || "UNKNOWN"}
                    </span>
                  </div>
                  <p>
                    <strong>Date:</strong>{" "}
                    {/* Check if order_date is a valid date string/number */}
                    {order.order_date &&
                    !isNaN(new Date(order.order_date).getTime())
                      ? format(new Date(order.order_date), "Pp")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Total:</strong> $
                    {/* Ensure total_price is a number */}
                    {typeof order.total_price === "number"
                      ? order.total_price.toFixed(2)
                      : "N/A"}
                  </p>
                  <div className={styles.orderDetails}>
                    <h4>Items:</h4>
                    {/* Ensure orderDetails is an array */}
                    {Array.isArray(order.orderDetails) &&
                    order.orderDetails.length > 0 ? (
                      <ul>
                        {order.orderDetails.map((detail) => (
                          // Use a guaranteed unique key, combination might be needed if id isn't present
                          <li
                            key={
                              detail.id ||
                              `item-${detail.menu_item_id}-${detail.quantity}`
                            }
                          >
                            {detail.menuItem?.name ||
                              `Item ID: ${detail.menu_item_id}`}{" "}
                            - Qty: {detail.quantity} (@ $
                            {/* Ensure price_per_item is a number */}
                            {typeof detail.price_per_item === "number"
                              ? detail.price_per_item.toFixed(2)
                              : "N/A"}
                            )
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: "0.9em", color: "grey" }}>
                        No item details available for this order.
                      </p>
                    )}
                  </div>
                  {/* Allow cancelling only if status is PENDING */}
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
