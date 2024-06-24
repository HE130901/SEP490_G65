"use client";

import { useState } from "react";
import ServiceCard from "@/components/ui/ServiceCard";
import VisitScheduleDialog from "@/components/dashboard/VisitScheduleDialog";

export default function ServicesList({ containers }) {
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);

  const services = [
    {
      title: "Đặt ô chứa",
      imageSrc: "/images/booking2.jpg",
      href: "/niche-reservation",
    },
    {
      title: "Đặt lịch viếng",
      imageSrc: "/images/visit.jpg",
      href: "#",
      onClick: () => setIsVisitDialogOpen(true),
    },
    {
      title: "Đặt dịch vụ",
      imageSrc: "/images/servicee.png",
      href: "/service-order",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Danh sách dịch vụ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((item, index) => (
          <ServiceCard
            key={index}
            href={item.href}
            imageSrc={item.imageSrc}
            title={item.title}
            onClick={item.onClick}
          />
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
