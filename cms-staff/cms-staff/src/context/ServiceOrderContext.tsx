"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { toast } from "react-toastify";

interface ServiceOrder {
  serviceOrderDetails: any;
  serviceOrderId: number;
  serviceOrderCode: string;
  customerName: string;
  formattedOrderDate: string;
  services: { serviceName: string; quantity: number }[];
  statuses: { status: string }[];
}

interface ServiceOrderContextProps {
  serviceOrders: ServiceOrder[];
  fetchServiceOrders: () => void;
  addServiceOrder: (order: ServiceOrder) => void;
  updateServiceOrder: (order: ServiceOrder) => void;
  deleteServiceOrder: (id: number) => void;
}

const ServiceOrderContext = createContext<ServiceOrderContextProps | undefined>(
  undefined
);

export const ServiceOrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);

  const fetchServiceOrders = async () => {
    try {
      const response = await ServiceOrderAPI.getAllServiceOrders();
      console.log(
        "Fetched Service Orders:",
        response.data.$values || response.data
      );
      setServiceOrders(response.data.$values || response.data);
    } catch (error) {
      console.error("Error fetching service orders:", error);
      toast.error("Không thể tải danh sách đơn dịch vụ");
    }
  };

  const addServiceOrder = (order: ServiceOrder) => {
    setServiceOrders((prev) => [...prev, order]);
  };

  const updateServiceOrder = (updatedOrder: ServiceOrder) => {
    setServiceOrders((prev) =>
      prev.map((order) =>
        order.serviceOrderId === updatedOrder.serviceOrderId
          ? updatedOrder
          : order
      )
    );
  };

  const deleteServiceOrder = (id: number) => {
    setServiceOrders((prev) =>
      prev.filter((order) => order.serviceOrderId !== id)
    );
  };

  useEffect(() => {
    fetchServiceOrders();
  }, []);

  return (
    <ServiceOrderContext.Provider
      value={{
        serviceOrders,
        fetchServiceOrders,
        addServiceOrder,
        updateServiceOrder,
        deleteServiceOrder,
      }}
    >
      {children}
    </ServiceOrderContext.Provider>
  );
};

export const useServiceOrderContext = () => {
  const context = useContext(ServiceOrderContext);
  if (!context) {
    throw new Error(
      "useServiceOrderContext must be used within a ServiceOrderProvider"
    );
  }
  return context;
};
