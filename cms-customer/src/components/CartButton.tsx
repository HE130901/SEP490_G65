"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export const CartButton = () => {
  const { items, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button className="" onClick={() => setIsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>{" "}
        Giỏ hàng
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
    </>
  );
};
