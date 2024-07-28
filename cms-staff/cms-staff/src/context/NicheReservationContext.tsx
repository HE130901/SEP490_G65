// NicheReservationContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import NicheReservationAPI from "@/services/nicheReservationService";
import { toast } from "react-toastify";

interface NicheReservation {
  reservationId: number;
  reservationCode: string;
  nicheAddress: string;
  name: string;
  phoneNumber: string;
  formattedCreatedDate: string;
  formattedConfirmationDate: string;
  status: string;
}

interface NicheReservationContextProps {
  reservations: NicheReservation[];
  fetchReservations: () => void;
  addReservation: (reservation: NicheReservation) => void;
  updateReservation: (updatedReservation: NicheReservation) => void;
  deleteReservation: (reservationId: number) => void;
}

const NicheReservationContext = createContext<
  NicheReservationContextProps | undefined
>(undefined);

export const NicheReservationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [reservations, setReservations] = useState<NicheReservation[]>([]);

  const fetchReservations = async () => {
    try {
      const response = await NicheReservationAPI.getAllNicheReservations();
      setReservations(response.data.$values || response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn đặt chỗ");
    }
  };

  const addReservation = (reservation: NicheReservation) => {
    setReservations((prev) => [...prev, reservation]);
  };

  const updateReservation = (updatedReservation: NicheReservation) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.reservationId === updatedReservation.reservationId
          ? updatedReservation
          : reservation
      )
    );
  };

  const deleteReservation = (reservationId: number) => {
    setReservations((prev) =>
      prev.filter((reservation) => reservation.reservationId !== reservationId)
    );
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <NicheReservationContext.Provider
      value={{
        reservations,
        fetchReservations,
        addReservation,
        updateReservation,
        deleteReservation,
      }}
    >
      {children}
    </NicheReservationContext.Provider>
  );
};

export const useNicheReservationContext = () => {
  const context = useContext(NicheReservationContext);
  if (!context) {
    throw new Error(
      "useNicheReservationContext must be used within a NicheReservationProvider"
    );
  }
  return context;
};
