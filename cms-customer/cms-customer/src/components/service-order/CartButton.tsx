// CartButton.tsx
"use client";

import { forwardRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { CartModal } from "@/components/service-order/CartModal";

export const CartButton = forwardRef<HTMLDivElement>((props, ref) => {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div ref={ref} className="relative">
      <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>

        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 block h-5 w-5 rounded-full bg-red-600 text-white text-xs leading-tight text-center">
            {items.length}
          </span>
        )}
      </Button>
      <CartModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
});
CartButton.displayName = "CartButton";
