import axiosInstance from "./axiosInstance";
import { User } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  // FIX: Hapus /api/ dari awal path
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login", // <-- Path diperbaiki
    credentials
  );
  return response.data;
};

export const registerUser = async (data: RegisterData): Promise<User> => {
  // FIX: Hapus /api/ dari awal path
  const response = await axiosInstance.post<User>(
    "/auth/register", // <-- Path diperbaiki
    data
  );
  return response.data;
};
