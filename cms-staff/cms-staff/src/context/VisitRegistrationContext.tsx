"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface VisitRegistrationDto {
  visitId: number;
  customerId: number;
  nicheId: number;
  customerName: string;
  staffName: string;
  nicheAddress: string;
  createdDate: string;
  visitDate: string;
  status: string;
  accompanyingPeople: number;
  note: string;
  approvedBy?: number;
  formattedVisitDate: string;
  formattedCreatedDate: string;
  visitCode: string;
}

interface VisitRegistrationContextProps {
  visitRegistrations: VisitRegistrationDto[];
  fetchVisitRegistrations: () => void;
  addVisitRegistration: (visit: VisitRegistrationDto) => void;
  updateVisitRegistration: (visit: VisitRegistrationDto) => void;
  deleteVisitRegistration: (visitId: number) => void;
}

const VisitRegistrationContext = createContext<
  VisitRegistrationContextProps | undefined
>(undefined);

export const VisitRegistrationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [visitRegistrations, setVisitRegistrations] = useState<
    VisitRegistrationDto[]
  >([]);

  const fetchVisitRegistrations = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/VisitRegistrations");
      setVisitRegistrations(response.data.$values || response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn đăng ký");
    }
  }, []);

  const addVisitRegistration = (visit: VisitRegistrationDto) => {
    setVisitRegistrations((prev) => [...prev, visit]);
  };

  const updateVisitRegistration = (updatedVisit: VisitRegistrationDto) => {
    setVisitRegistrations((prev) =>
      prev.map((visit) =>
        visit.visitId === updatedVisit.visitId ? updatedVisit : visit
      )
    );
  };

  const deleteVisitRegistration = (visitId: number) => {
    setVisitRegistrations((prev) =>
      prev.filter((visit) => visit.visitId !== visitId)
    );
  };

  return (
    <VisitRegistrationContext.Provider
      value={{
        visitRegistrations,
        fetchVisitRegistrations,
        addVisitRegistration,
        updateVisitRegistration,
        deleteVisitRegistration,
      }}
    >
      {children}
    </VisitRegistrationContext.Provider>
  );
};

export const useVisitRegistrationContext = () => {
  const context = useContext(VisitRegistrationContext);
  if (!context) {
    throw new Error(
      "useVisitRegistrationContext must be used within a VisitRegistrationProvider"
    );
  }
  return context;
};
