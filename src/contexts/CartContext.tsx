import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { CartItem, MenuItem, CartState } from "../types";

interface CartContextProps extends CartState {
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "coffeeCart";

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartState, setCartState] = useState<CartState>({ items: [] });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        // Pastikan harga adalah number
        parsedCart.forEach((item) => {
          item.menuItem.price = Number(item.menuItem.price);
        });
        setCartState({ items: parsedCart });
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.removeItem(CART_STORAGE_KEY); // Hapus data invalid
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items));
  }, [cartState.items]);

  const addToCart = useCallback((item: MenuItem, quantity: number = 1) => {
    setCartState((prevState) => {
      const existingItemIndex = prevState.items.findIndex(
        (cartItem) => cartItem.menuItem.id === item.id
      );
      let newItems = [...prevState.items];

      if (existingItemIndex > -1) {
        // Item sudah ada, tambahkan quantity
        const existingItem = newItems[existingItemIndex];
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
      } else {
        // Item baru, tambahkan ke cart
        newItems.push({
          menuItem: { ...item, price: Number(item.price) },
          quantity,
        }); // Pastikan harga number
      }
      return { items: newItems };
    });
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setCartState((prevState) => ({
      items: prevState.items.filter((item) => item.menuItem.id !== itemId),
    }));
  }, []);

  const updateQuantity = useCallback(
    (itemId: number, newQuantity: number) => {
      if (newQuantity <= 0) {
        // Jika quantity 0 atau kurang, hapus item
        removeFromCart(itemId);
      } else {
        setCartState((prevState) => ({
          items: prevState.items.map((item) =>
            item.menuItem.id === itemId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }));
      }
    },
    [removeFromCart]
  ); // Tambahkan removeFromCart sebagai dependency

  const clearCart = useCallback(() => {
    setCartState({ items: [] });
    // localStorage akan otomatis terupdate oleh useEffect
  }, []);

  const getCartTotal = useCallback((): number => {
    return cartState.items.reduce((total, item) => {
      return total + Number(item.menuItem.price) * item.quantity;
    }, 0);
  }, [cartState.items]);

  return (
    <CartContext.Provider
      value={{
        ...cartState,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
