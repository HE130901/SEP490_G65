"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PaymentModal } from "./PaymentModal";
import ItemType from "./ItemType"; // Import the ItemType type from the appropriate module

interface CartModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CartModal = ({ isOpen, setIsOpen }: CartModalProps) => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    console.log("Cart modal state changed:", open);
  };

  const handlePaymentOpen = () => {
    setIsOpen(false);
    setTimeout(() => {
      setPaymentModalOpen(true);
    }, 300); // Adjust the delay as needed
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleDecreaseQuantity = (item: ItemType) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncreaseQuantity = (item: ItemType) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const totalAmount = calculateTotal();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Giỏ Hàng Của Bạn</h2>
          </div>
          {items.length > 0 ? (
            <div>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                        <p className="text-sm text-gray-500">
                          {(item.price * item.quantity).toLocaleString()} ₫
                        </p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-400 w-8 h-8 hover:bg-red-500"
                            onClick={() => handleDecreaseQuantity(item)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-400 w-8 h-8 hover:bg-green-500"
                            onClick={() => handleIncreaseQuantity(item)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {totalAmount.toLocaleString()} ₫
                  </span>
                </div>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handlePaymentOpen}
                >
                  Tiến hành thanh toán
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Giỏ hàng của bạn trống.</p>
          )}
        </DialogContent>
      </Dialog>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        setIsOpen={setPaymentModalOpen}
        totalAmount={totalAmount}
      />
    </>
  );
};
