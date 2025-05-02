import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedJwtPayload, User, AuthState } from "../types";
import { getProfile } from "../api/userApi";
import { loginUser as apiLogin } from "../api/authApi"; // Rename import

interface AuthContextProps extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => void;
  // Tidak perlu manual check token, handle saat API call gagal
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true, // Mulai dengan loading true untuk cek token awal
  });

  const loadUserFromToken = useCallback(async (token: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const decoded = jwtDecode<DecodedJwtPayload>(token);
      // Cek expiry (opsional, backend akan memvalidasi juga)
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        throw new Error("Token expired");
      }

      // Set token di state dan localStorage
      localStorage.setItem("coffeeToken", token);

      // Ambil profile user dari API menggunakan token yg sudah di header via interceptor
      const userProfile = await getProfile();

      setAuthState({
        isAuthenticated: true,
        user: userProfile,
        token: token,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load user from token:", error);
      localStorage.removeItem("coffeeToken"); // Hapus token invalid
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("coffeeToken");
    if (token) {
      loadUserFromToken(token);
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false })); // Selesai loading jika tidak ada token
    }
  }, [loadUserFromToken]);

  const login = async (token: string) => {
    await loadUserFromToken(token); // Gunakan fungsi yang sama untuk memuat user setelah login
  };

  const logout = () => {
    localStorage.removeItem("coffeeToken");
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
    // Redirect atau tindakan lain bisa dilakukan di komponen pemanggil
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
