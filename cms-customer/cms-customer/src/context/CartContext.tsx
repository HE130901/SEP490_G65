"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void; // Add clearCart function
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("cartItems");
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        setItems(parsedItems);
        console.log("Loaded items from localStorage:", parsedItems);
      }
    } catch (error) {
      console.error("Failed to load items from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
      console.log("Stored items in localStorage:", items);
    } catch (error) {
      console.error("Failed to store items in localStorage", error);
    }
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]); // Clear all items from the cart
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }} // Include clearCart
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
