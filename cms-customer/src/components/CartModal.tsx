"use client";

import { useCart } from "@/context/CartContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ShoppingCartIcon } from "lucide-react";

const CartModal: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenCartModal = () => setIsOpen(true);
    document.addEventListener("open-cart-modal", handleOpenCartModal);
    return () => {
      document.removeEventListener("open-cart-modal", handleOpenCartModal);
    };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className="absolute top-0 right-0 mt-2 mr-2"
      >
        <ShoppingCartIcon className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cart.length}
          </span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Open Cart</Button>
        </DialogTrigger>
        <DialogContent className="fixed top-10 right-10 max-w-sm w-full bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Giỏ hàng</h2>
          {cart.length === 0 ? (
            <p>Giỏ hàng của bạn đang trống.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <div>
                      <h3 className="text-lg">{item.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-16 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-500"
                      >
                        Xóa
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="text-right mt-4">
                <h3 className="text-xl font-semibold">
                  Tổng cộng:{" "}
                  {total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h3>
                <Button
                  variant="destructive"
                  onClick={clearCart}
                  className="mt-2"
                >
                  Xóa tất cả
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartModal;
