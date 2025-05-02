import axiosInstance from "./axiosInstance";
import { MenuItem, PaginatedResponse, MenuItemCategory } from "../types"; // Tambahkan MenuItemCategory jika perlu untuk DTO

// --- DTO Types (bisa juga diletakkan di src/types) ---
export interface CreateMenuItemPayload {
  name: string;
  description?: string;
  price: number;
  category: MenuItemCategory;
  is_available?: boolean;
  image_url?: string;
}

// Update DTO biasanya Partial dari Create DTO
export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>;
// ------------------------------------------------------

interface MenuQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  available?: boolean;
}

export const getMenuItems = async (
  params?: MenuQueryParams
): Promise<PaginatedResponse<MenuItem>> => {
  const response = await axiosInstance.get<PaginatedResponse<MenuItem>>(
    "/menu",
    { params }
  );
  response.data.data = response.data.data.map((item) => ({
    ...item,
    price: Number(item.price),
  }));
  return response.data;
};

export const getMenuItemById = async (id: number): Promise<MenuItem> => {
  const response = await axiosInstance.get<MenuItem>(`/menu/${id}`);
  response.data.price = Number(response.data.price);
  return response.data;
};

// --- FUNGSI CRUD BARU (ADMIN) ---
export const createMenuItem = async (
  payload: CreateMenuItemPayload
): Promise<MenuItem> => {
  const response = await axiosInstance.post<MenuItem>("/menu", payload);
  response.data.price = Number(response.data.price);
  return response.data;
};

export const updateMenuItem = async (
  id: number,
  payload: UpdateMenuItemPayload
): Promise<MenuItem> => {
  const response = await axiosInstance.patch<MenuItem>(`/menu/${id}`, payload);
  response.data.price = Number(response.data.price);
  return response.data;
};

export const deleteMenuItem = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/menu/${id}`);
};
// --------------------------------
