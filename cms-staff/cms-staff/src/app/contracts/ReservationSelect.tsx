import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface Reservation {
  reservationId: number;
  reservationCode: string;
  nicheId: number;
  status: string;
  customerName: string;
  customerPhone: string;
  nicheCode: string;
  nicheAddress: string;
  signAddress: string;
  note: string;
}

interface ReservationSelectProps {
  reservations: Reservation[];
  selectedReservationCode: string;
  onSelect: (reservationCode: string) => void;
}

const ReservationSelect: React.FC<ReservationSelectProps> = ({
  reservations,
  selectedReservationCode,
  onSelect,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onSelect(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id="reservation-select-label">
        {" "}
        <span>
          Chọn đơn đăng ký <span style={{ color: "red" }}>*</span>
        </span>
      </InputLabel>
      <Select
        labelId="reservation-select-label"
        value={selectedReservationCode}
        onChange={handleChange}
        label={
          <span>
            Chọn đơn đăng ký <span style={{ color: "red" }}>*</span>
          </span>
        }
      >
        {reservations.map((reservation) => (
          <MenuItem
            key={reservation.reservationId}
            value={reservation.reservationCode}
          >
            {reservation.reservationCode} | {reservation.nicheCode} |{" "}
            {reservation.customerName} | {reservation.customerPhone}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ReservationSelect;
