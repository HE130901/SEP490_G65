"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import Image from "next/image";

interface ServiceCardProps {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  price,
  imageSrc,
}) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart({ id, name, price, quantity: 1 });
    document.dispatchEvent(new Event("open-cart-modal"));
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden relative">
      <Image
        src={imageSrc}
        alt={name}
        width={400}
        height={300}
        className="w-full h-60 object-cover"
      />
      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <button
          onClick={handleAddToCart}
          className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
