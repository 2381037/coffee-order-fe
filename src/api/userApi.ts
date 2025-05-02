import axiosInstance from "./axiosInstance";
import { User, UserRole, PaginatedResponse } from "../types"; // Tambahkan UserRole, PaginatedResponse

// --- DTO Types ---
export interface UpdateUserPayload {
  name?: string;
  // Tambahkan field lain yang boleh diupdate admin (misal: role)
  role?: UserRole;
}
// -----------------

interface UserQueryParams {
  // Untuk admin fetch all
  page?: number;
  limit?: number;
  role?: UserRole;
}

export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/users/profile");
  return response.data;
};

// --- FUNGSI CRUD BARU (ADMIN) ---
export const getUsers = async (
  params?: UserQueryParams
): Promise<PaginatedResponse<User>> => {
  const response = await axiosInstance.get<PaginatedResponse<User>>("/users", {
    params,
  });
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
};

// Admin mungkin tidak membuat user baru via API ini (pakai register?), tapi jika perlu:
// export const createUser = async (payload: CreateUserPayload): Promise<User> => { ... }

export const updateUser = async (
  id: number,
  payload: UpdateUserPayload
): Promise<User> => {
  const response = await axiosInstance.patch<User>(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
// --------------------------------
