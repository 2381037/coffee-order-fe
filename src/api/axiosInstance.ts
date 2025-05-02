// src/api/axiosInstance.ts
import axios from "axios";

// Baca base URL dari environment variable Vite
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // Tidak perlu fallback jika wajib ada

// Tambahkan pengecekan untuk memastikan variabel env ada saat runtime (opsional tapi bagus)
if (!apiBaseUrl) {
  console.error(
    "FATAL ERROR: VITE_API_BASE_URL environment variable is not set!"
  );
  // Anda bisa throw error atau set default darurat di sini
  // throw new Error("VITE_API_BASE_URL is not defined");
}

console.log("API Base URL:", apiBaseUrl);

const axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Gunakan variabel yang dibaca dari .env
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor (tetap sama)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("coffeeToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
