// ProductList.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/formatCurrency";
import { useCart } from "@/context/CartContext";
import { CartButton } from "@/components/service-order/CartButton";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

interface ProductListProps {
  products: any[];
  viewMode: string;
}

export default function ProductList({ products, viewMode }: ProductListProps) {
  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = (product, event) => {
    addToCart({ ...product, quantity: 1 });
    setAddedProductId(product.id);
    toast.success(`${product.name} đã được thêm vào giỏ hàng`);

    const imgToFly = event.target.closest(".product-card").querySelector("img");
    const imgClone = imgToFly.cloneNode(true);
    const cartIcon = cartIconRef.current;

    if (cartIcon) {
      imgClone.style.position = "absolute";
      imgClone.style.zIndex = "999";
      imgClone.style.top = `${imgToFly.getBoundingClientRect().top}px`;
      imgClone.style.left = `${imgToFly.getBoundingClientRect().left}px`;
      imgClone.style.width = `${imgToFly.getBoundingClientRect().width}px`;
      imgClone.style.height = `${imgToFly.getBoundingClientRect().height}px`;
      document.body.appendChild(imgClone);

      const moveToCart = () => {
        imgClone.style.transition = "all 1s ease";
        imgClone.style.top = `${
          cartIcon.getBoundingClientRect().top + window.scrollY
        }px`;
        imgClone.style.left = `${
          cartIcon.getBoundingClientRect().left + window.scrollX
        }px`;
        imgClone.style.width = "20px";
        imgClone.style.height = "20px";
        imgClone.style.opacity = "0";
      };

      requestAnimationFrame(moveToCart);

      setTimeout(() => {
        imgClone.remove();
      }, 1000);

      setTimeout(() => {
        setAddedProductId(null);
      }, 1000);
    } else {
      console.error("Cart icon reference is null.");
      toast.error("Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-end mb-4">
        <CartButton ref={cartIconRef} />
      </div>
      <div
        className={`grid ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1"
        } gap-6`}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className={`product-card bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden ${
                viewMode === "list" ? "flex items-center gap-4" : ""
              }`}
            >
              <Link href="#" className="block" prefetch={false}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className={`w-full ${
                    viewMode === "list"
                      ? "h-24 object-cover"
                      : "h-60 object-cover"
                  }`}
                />
              </Link>
              <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {formatVND(product.price)}
                  </span>
                  <Button
                    size="sm"
                    onClick={(event) => handleAddToCart(product, event)}
                    className={`${
                      addedProductId === product.id ? "animate-bounce" : ""
                    }`}
                  >
                    Thêm vào giỏ
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy sản phẩm</p>
        )}
      </div>
    </div>
  );
}
