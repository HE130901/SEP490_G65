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
  confirmReservation: (reservationId: number) => void;
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

  const addReservation = async (reservation: NicheReservation) => {
    try {
      await NicheReservationAPI.createNicheReservation(reservation);
      fetchReservations();
      toast.success("Đơn đăng ký đã được thêm thành công");
    } catch (error) {
      toast.error("Không thể thêm đơn đăng ký");
    }
  };

  const updateReservation = async (updatedReservation: NicheReservation) => {
    try {
      await NicheReservationAPI.updateNicheReservation(
        updatedReservation.reservationId,
        updatedReservation
      );
      fetchReservations();
      toast.success("Đơn đăng ký đã được cập nhật thành công");
    } catch (error) {
      toast.error("Không thể cập nhật đơn đăng ký");
    }
  };

  const deleteReservation = async (reservationId: number) => {
    try {
      await NicheReservationAPI.deleteNicheReservation(reservationId);
      fetchReservations();
      toast.success("Đơn đăng ký đã được từ chối");
    } catch (error) {
      toast.error("Không thể từ chối đơn đăng ký");
    }
  };

  const confirmReservation = async (reservationId: number) => {
    try {
      await NicheReservationAPI.confirmNicheReservation(reservationId);
      fetchReservations();
      toast.success("Đơn đăng ký đã được xác nhận");
    } catch (error) {
      toast.error("Không thể xác nhận đơn đăng ký");
    }
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
        confirmReservation,
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
