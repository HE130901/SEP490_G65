// ServiceContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import ServiceAPI from "@/services/serviceService";
import { Service } from "./interfaces";
import { toast } from "react-toastify";

interface ServiceContextProps {
  services: Service[];
  fetchServices: () => void;
  addService: (service: Service) => void;
  updateService: (updatedService: Service) => void;
  deleteService: (serviceId: number) => void;
}

const ServiceContext = createContext<ServiceContextProps | undefined>(
  undefined
);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    try {
      const response = await ServiceAPI.getAllServices();
      setServices(response.data.$values || response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách dịch vụ");
    }
  };

  const addService = (service: Service) => {
    setServices((prev) => [...prev, service]);
  };

  const updateService = (updatedService: Service) => {
    setServices((prev) =>
      prev.map((service) =>
        service.serviceId === updatedService.serviceId
          ? updatedService
          : service
      )
    );
  };

  const deleteService = (serviceId: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.serviceId === serviceId
          ? { ...service, status: "Unavailable" } // Cập nhật trạng thái
          : service
      )
    );
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        fetchServices,
        addService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};
