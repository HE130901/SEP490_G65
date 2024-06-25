"use client";

import { useState } from "react";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";
import VisitScheduleDialog from "@/components/dashboard/VisitScheduleDialog";

export default function ServicesList({ containers }) {
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);

  const services = [
    {
      title: "Đặt ô chứa",
      imageSrc: "/images/booking2.jpg",
      href: "/niche-reservation",
      priority: true, // Add priority for this image
    },
    {
      title: "Đặt lịch viếng",
      imageSrc: "/images/visit.jpg",
      href: "#",
      onClick: () => setIsVisitDialogOpen(true),
      priority: true, // Add priority for this image
    },
    {
      title: "Đặt dịch vụ",
      imageSrc: "/images/servicee.png",
      href: "/service-order",
      priority: true, // Add priority for this image
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Dịch vụ dành cho bạn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((item, index) => (
          <div key={index} className="group relative block h-full">
            <Link
              href={item.href}
              passHref
              onClick={item.onClick}
              className="h-full w-full block transition-transform duration-200 transform group-hover:scale-105"
            >
              <ServiceCard
                href={item.href}
                imageSrc={item.imageSrc}
                title={item.title}
                priority={item.priority} // Pass priority prop
              />
            </Link>
          </div>
        ))}
      </div>
      <VisitScheduleDialog
        isOpen={isVisitDialogOpen}
        onClose={() => setIsVisitDialogOpen(false)}
        onSubmit={() => setIsVisitDialogOpen(false)}
        containers={containers}
      />
    </div>
  );
}
