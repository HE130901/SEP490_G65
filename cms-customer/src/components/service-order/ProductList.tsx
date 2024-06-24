"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/formatCurrency";
import { useCart } from "@/context/CartContext";

interface ProductListProps {
  products: any[];
  viewMode: string;
}

export default function ProductList({ products, viewMode }: ProductListProps) {
  const { addToCart } = useCart();

  return (
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
            className={`bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden ${
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
                  onClick={() => {
                    addToCart(product);
                    console.log("Product added to cart:", product);
                  }}
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
  );
}
