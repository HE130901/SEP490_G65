// CartButton.tsx
"use client";

import { forwardRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartModal from "@/components/service-order/CartModal";
import { styled } from "@mui/system";

import { Button } from "@/components/ui/button";

export const CartButton = forwardRef<HTMLDivElement>((props, ref) => {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        className="shrink-0"
        onClick={() => setIsOpen(true)}
      >
        <Badge badgeContent={items.length} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Button>
      <CartModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
});

CartButton.displayName = "CartButton";
