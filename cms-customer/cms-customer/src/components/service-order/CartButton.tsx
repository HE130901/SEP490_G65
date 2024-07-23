// CartButton.tsx
"use client";

import { forwardRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button, Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartModal from "@/components/service-order/CartModal";

export const CartButton = forwardRef<HTMLDivElement>((props, ref) => {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div ref={ref} className="relative">
      <IconButton onClick={() => setIsOpen(true)}>
        <Badge badgeContent={items.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <CartModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
});
CartButton.displayName = "CartButton";
