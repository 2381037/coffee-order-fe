// src/pages/Admin/OrderManagementPage.tsx (Frontend)
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import {
  getOrders,
  deleteOrder,
  updateOrderStatus,
  UpdateOrderStatusPayload,
} from "../../api/orderApi";
import { Order, OrderStatus, User } from "../../types";
import { format } from "date-fns";
import styles from "../styles/ManagementPage.module.css";

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Inisialisasi array kosong
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [viewingOrder, setViewingOrder] = useState<Order | null>(null); // State detail opsional

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrders({ limit: 100 });
      // FIX: Cek response dan response.data sebelum akses
      if (response && response.data) {
        const ordersWithSafeUser = response.data.map((order) => ({
          ...order,
          user: order.user || ({ email: "N/A" } as User), // Handle user null
        }));
        setOrders(ordersWithSafeUser);
      } else {
        setOrders([]);
        setError("Received invalid data structure for orders.");
      }
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      setError(
        `Failed to load orders: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      setOrders([]); // Set array kosong jika fetch gagal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
        fetchOrders();
        alert("Order deleted successfully.");
      } catch (err: any) {
        console.error("Delete order error:", err);
        alert(
          `Failed to delete order: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    }
  };

  const handleStatusChange = async (
    id: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value as OrderStatus;
    try {
      const payload: UpdateOrderStatusPayload = { status: newStatus };
      await updateOrderStatus(id, payload);
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      alert("Order status updated successfully.");
    } catch (err: any) {
      console.error("Update status error:", err);
      alert(err.response?.data?.message || "Failed to update order status.");
    }
  };

  // --- JSX ---
  return (
    <div>
      <h2>Manage Orders</h2>
      {loading && <p>Loading orders...</p>}
      {/* Tampilkan error fetch utama */}
      {error && <p className="alert alert-danger">{error}</p>}
      {/* Pengecekan orders.length sekarang aman */}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}
      {!loading && orders.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataTable}>
            {/* ... thead tabel ... */}
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User Email</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user?.email ?? "N/A"}</td>
                  <td>
                    {order.order_date
                      ? format(new Date(order.order_date), "Pp")
                      : "N/A"}
                  </td>
                  <td>${Number(order.total_price).toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e)}
                      className={`${styles.statusSelect} ${
                        styles[`statusSelect${order.status}`]
                      }`}
                    >
                      {Object.values(OrderStatus).map((stat) => (
                        <option key={stat} value={stat}>
                          {stat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
