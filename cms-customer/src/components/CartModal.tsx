"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export const CartModal = forwardRef((_, ref) => {
  const { items, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed top-4 right-4" onClick={() => setIsOpen(true)}>
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
              d="M3 3h2l.09.27a5 5 0 004.69 3.46l1.35 1.92M13 5.27l1.35-1.92M3 3l5 14a5 5 0 004.69 3.46L19 20m0 0a5 5 0 00-4.69-3.46L13 10.73M5 17a2 2 0 104 0M3 3a2 2 0 104 0"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <img src={item.image} alt={item.name} className="w-10 h-10" />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{item.price} VND</span>
                <Button onClick={() => removeFromCart(item.id)} size="sm">
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p>Your cart is empty.</p>}
        <DialogClose asChild>
          <Button className="mt-4" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
});
