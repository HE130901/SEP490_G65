"use client";

import { useState, useEffect } from "react";
import ContainerList from "./ContainerList";
import ContainerDetailsDialog from "./ContainerDetailsDialog";
import VisitScheduleDialog from "./VisitScheduleDialog";
import ContractManagementDialog from "./ContractManagementDialog";
import ServiceOrderDialog from "./ServiceOrderDialog";
import axiosInstance from "@/api/axios-config";

export default function CustomerNiches({ customerId = 1 }) {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [isContainerModalOpen, setIsContainerModalOpen] = useState(false);
  const [isVisitScheduleModalOpen, setIsVisitScheduleModalOpen] =
    useState(false);
  const [isContractManagementModalOpen, setIsContractManagementModalOpen] =
    useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/niches/customer/${customerId}`
        );

        // Ensure response.data is an object and has $values property
        if (response.data && Array.isArray(response.data.$values)) {
          setContainers(response.data.$values);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching niches:", error);
      }
    };

    fetchContainers();
  }, [customerId]);

  const handleContainerSelect = (container) => {
    setSelectedContainer(container);
    setIsContainerModalOpen(true);
  };

  const handleVisitSchedule = (container) => {
    setSelectedContainer(container);
    setIsVisitScheduleModalOpen(true);
  };

  const handleServiceOrder = (container) => {
    setSelectedContainer(container);
    setIsServiceModalOpen(true);
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <header className="bg-card py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản Lý Ô Chứa</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <ContainerList
          containers={containers}
          onSelect={handleContainerSelect}
          onVisitSchedule={handleVisitSchedule}
          onServiceOrder={handleServiceOrder}
        />
      </main>
      <ContainerDetailsDialog
        isOpen={isContainerModalOpen}
        onClose={() => setIsContainerModalOpen(false)}
        container={selectedContainer}
      />
      <VisitScheduleDialog
        isOpen={isVisitScheduleModalOpen}
        onClose={() => setIsVisitScheduleModalOpen(false)}
        onSubmit={(data) => console.log("Submit visit schedule", data)} // Replace with actual handler
        containers={containers}
      />
      <ContractManagementDialog
        isOpen={isContractManagementModalOpen}
        onClose={() => setIsContractManagementModalOpen(false)}
        onSubmit={(data) => console.log("Submit contract", data)} // Replace with actual handler
        container={selectedContainer}
        action={selectedContainer?.action}
      />
      <ServiceOrderDialog
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />
    </div>
  );
}
