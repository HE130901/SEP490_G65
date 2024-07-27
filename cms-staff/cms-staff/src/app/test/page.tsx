"use client";
import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

const ReservationSelect: React.FC = () => {
  const [reservations, setReservations] = useState<
    Array<{ reservationId: string; reservationCode: string }>
  >([]);
  const [selectedReservationCode, setSelectedReservationCode] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("/api/NicheReservations/approved");
        setReservations(response.data.$values || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Failed to load reservations.");
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedReservationCode(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="reservation-select-label">Chọn đơn đăng ký</InputLabel>
      <Select
        labelId="reservation-select-label"
        value={selectedReservationCode}
        onChange={handleSelectChange}
        displayEmpty
        label="Chọn đơn đăng ký"
      >
        {reservations.map((reservation) => (
          <MenuItem
            key={reservation.reservationId}
            value={reservation.reservationCode}
          >
            {reservation.reservationCode}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ReservationSelect;
