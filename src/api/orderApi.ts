// src/api/orderApi.ts
import axiosInstance from "./axiosInstance";
import {
  Order,
  CreateOrderPayload,
  PaginatedResponse,
  OrderStatus,
  OrderDetail, // Tambahkan OrderDetail jika belum ada
} from "../types";

// --- DTO Types ---
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
// -----------------

interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
}

// --- Implementasi Fungsi yang Sebelumnya Hilang ---

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  console.log("API: Calling POST /orders with payload:", payload);
  const response = await axiosInstance.post<Order>("/orders", payload);
  console.log("API: Response from POST /orders:", response);

  // Lakukan konversi dan pengecekan setelah menerima respons
  const orderData = response.data;
  if (orderData) {
    orderData.total_price = Number(orderData.total_price);
    orderData.orderDetails = Array.isArray(orderData.orderDetails)
      ? orderData.orderDetails.map((detail) => ({
          ...detail,
          price_per_item: Number(detail.price_per_item),
          subtotal: Number(detail.subtotal),
        }))
      : [];
  }
  return orderData || ({} as Order); // Kembalikan objek kosong jika response.data null/undefined
};

export const getOrders = async (
  params?: OrderQueryParams
): Promise<PaginatedResponse<Order>> => {
  console.log("API: Calling GET /orders with params:", params);
  try {
    const response = await axiosInstance.get<PaginatedResponse<Order>>(
      "/orders",
      { params }
    );
    console.log("API: Raw response from GET /orders:", response);

    // FIX: Lakukan pengecekan ketat pada struktur respons
    if (
      response &&
      response.data &&
      Array.isArray(response.data.data) &&
      typeof response.data.total === "number"
    ) {
      // Proses data di dalam array
      response.data.data = response.data.data.map((order) => {
        const details = Array.isArray(order.orderDetails)
          ? order.orderDetails.map((detail) => ({
              ...detail,
              price_per_item: Number(detail.price_per_item),
              subtotal: Number(detail.subtotal),
            }))
          : [];
        return {
          ...order,
          total_price: Number(order.total_price),
          orderDetails: details,
        };
      });
      console.log(
        "API: Processed response data for GET /orders:",
        response.data
      );
      return response.data; // Kembalikan data yang sudah diproses
    } else {
      // Jika struktur tidak sesuai, log error dan kembalikan struktur default kosong
      console.error(
        "API: Invalid data structure received from GET /orders:",
        response
      );
      return {
        data: [],
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
      };
    }
  } catch (error) {
    console.error("API: Error fetching GET /orders:", error);
    // Lempar ulang error agar bisa ditangkap oleh komponen pemanggil
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<Order> => {
  console.log(`API: Calling GET /orders/${id}`);
  const response = await axiosInstance.get<Order>(`/orders/${id}`);
  console.log(`API: Response from GET /orders/${id}:`, response);

  // Lakukan konversi dan pengecekan setelah menerima respons
  const orderData = response.data;
  if (orderData) {
    orderData.total_price = Number(orderData.total_price);
    orderData.orderDetails = Array.isArray(orderData.orderDetails)
      ? orderData.orderDetails.map((detail) => ({
          ...detail,
          price_per_item: Number(detail.price_per_item),
          subtotal: Number(detail.subtotal),
        }))
      : [];
  }
  return orderData || ({} as Order); // Kembalikan objek kosong jika response.data null/undefined
};

export const cancelOrder = async (id: number): Promise<Order> => {
  console.log(`API: Calling PATCH /orders/${id}/cancel`);
  const response = await axiosInstance.patch<Order>(`/orders/${id}/cancel`);
  console.log(`API: Response from PATCH /orders/${id}/cancel:`, response);

  // Lakukan konversi dan pengecekan setelah menerima respons
  const orderData = response.data;
  if (orderData) {
    orderData.total_price = Number(orderData.total_price);
    orderData.orderDetails = Array.isArray(orderData.orderDetails)
      ? orderData.orderDetails.map((detail) => ({
          ...detail,
          price_per_item: Number(detail.price_per_item),
          subtotal: Number(detail.subtotal),
        }))
      : [];
  }
  return orderData || ({} as Order); // Kembalikan objek kosong jika response.data null/undefined
};

// --- FUNGSI CRUD ADMIN ---
export const updateOrderStatus = async (
  id: number,
  payload: UpdateOrderStatusPayload
): Promise<Order> => {
  console.log(`API: Calling PATCH /orders/${id}/status with payload:`, payload);
  const response = await axiosInstance.patch<Order>(
    `/orders/${id}/status`,
    payload
  );
  console.log(`API: Response from PATCH /orders/${id}/status:`, response);

  // Lakukan konversi dan pengecekan setelah menerima respons
  const orderData = response.data;
  if (orderData) {
    orderData.total_price = Number(orderData.total_price);
    orderData.orderDetails = Array.isArray(orderData.orderDetails)
      ? orderData.orderDetails.map((detail) => ({
          ...detail,
          price_per_item: Number(detail.price_per_item),
          subtotal: Number(detail.subtotal),
        }))
      : [];
  }
  return orderData || ({} as Order); // Kembalikan objek kosong jika response.data null/undefined
};

export const deleteOrder = async (id: number): Promise<void> => {
  console.log(`API: Calling DELETE /orders/${id}`);
  await axiosInstance.delete(`/orders/${id}`);
  console.log(`API: DELETE /orders/${id} successful`);
};
// --------------------------------
