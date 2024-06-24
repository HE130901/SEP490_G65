"use client";

import Image from "next/image";

interface ServiceCardProps {
  href: string;
  imageSrc: string;
  category?: string; // Category có thể không bắt buộc
  title: string;
  onClick?: () => void; // Thêm onClick
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  href,
  imageSrc,
  category,
  title,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group block bg-black rounded-lg shadow-lg overflow-hidden relative cursor-pointer"
    >
      <div className="relative w-full h-56 md:h-64 overflow-hidden">
        <Image
          alt={title}
          src={imageSrc}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 z-10">
        {category && (
          <p className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
            {category}
          </p>
        )}
        <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>
      </div>
    </div>
  );
};

export default ServiceCard;
