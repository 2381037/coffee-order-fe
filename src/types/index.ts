// src/types/index.ts

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface DecodedJwtPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export enum MenuItemCategory {
  HOT = "Hot",
  COLD = "Cold",
  FOOD = "Food",
  OTHER = "Other",
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: MenuItemCategory;
  is_available: boolean;
  image_url?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface OrderDetail {
  id?: number;
  menu_item_id: number;
  quantity: number;
  price_per_item: number;
  subtotal: number;
  menuItem?: MenuItem;
}

export interface Order {
  id: number;
  user_id: number;
  user?: User; // Ambil User type, password sudah dihapus di backend
  order_date: string | Date;
  status: OrderStatus;
  total_price: number;
  updated_at: string | Date;
  orderDetails: OrderDetail[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface CartState {
  items: CartItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Payload untuk API create order
export interface CreateOrderPayload {
  orderDetails: {
    menuItemId: number;
    quantity: number;
  }[];
}
