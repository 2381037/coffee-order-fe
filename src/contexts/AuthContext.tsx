import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
// import { DecodedJwtPayload, AuthState, User } from "../types"; // REMOVED: User type import, as it's implicitly handled via AuthState
import { DecodedJwtPayload, AuthState } from "../types";
import { getProfile } from "../api/userApi";
// import { loginUser as apiLogin } from "../api/authApi"; // REMOVED: apiLogin was imported but never used in this file. Login happens outside this context.

interface AuthContextProps extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => void;
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
    isLoading: true,
  });

  const loadUserFromToken = useCallback(async (token: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const decoded = jwtDecode<DecodedJwtPayload>(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        throw new Error("Token expired");
      }

      localStorage.setItem("coffeeToken", token);

      const userProfile = await getProfile(); // Assumes getProfile uses the token set in axios interceptor

      setAuthState({
        isAuthenticated: true,
        user: userProfile,
        token: token,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load user from token:", error);
      localStorage.removeItem("coffeeToken");
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
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [loadUserFromToken]);

  const login = async (token: string) => {
    await loadUserFromToken(token);
  };

  const logout = () => {
    localStorage.removeItem("coffeeToken");
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
