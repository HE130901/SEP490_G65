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
