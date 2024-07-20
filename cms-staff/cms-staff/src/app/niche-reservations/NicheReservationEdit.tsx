"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import NicheReservationAPI from "@/services/nicheReservationService";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
];

const EditBookingRequestDialog = ({
  open,
  bookingRequest,
  onClose,
  onUpdateSuccess,
}: {
  open: boolean;
  bookingRequest: any;
  onClose: () => void;
  onUpdateSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    buildingId: "",
    floorId: "",
    areaId: "",
    nicheId: "",
    confirmationDate: new Date().toISOString(),
    signAddress: predefinedAddresses[0],
    phoneNumber: "",
    name: "",
    note: "",
  });

  const [buildings, setBuildings] = useState<any[]>([]);
  const [floors, setFloors] = useState<
    { floorId: string; floorName: string }[]
  >([]);
  const [areas, setAreas] = useState<{ areaId: string; areaName: string }[]>(
    []
  );
  const [niches, setNiches] = useState<
    { nicheId: string; nicheName: string }[]
  >([]);

  useEffect(() => {
    if (bookingRequest) {
      setFormData({
        buildingId: "",
        floorId: "",
        areaId: "",
        nicheId: bookingRequest.nicheId || "",
        confirmationDate:
          bookingRequest.confirmationDate || new Date().toISOString(),
        signAddress: bookingRequest.signAddress || predefinedAddresses[0],
        phoneNumber: bookingRequest.phoneNumber || "",
        name: bookingRequest.name || "",
        note: bookingRequest.note || "",
      });
    }
  }, [bookingRequest]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, signAddress: e.target.value }));
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axiosInstance.get("/api/Locations/buildings");
        setBuildings(response.data.$values);
      } catch (error) {
        toast.error("Không thể tải danh sách nhà");
      }
    };

    fetchBuildings();
  }, []);

  const handleBuildingChange = async (event: SelectChangeEvent<string>) => {
    const buildingId = event.target.value as string;
    setFormData((prevData) => ({
      ...prevData,
      buildingId,
      floorId: "",
      areaId: "",
      nicheId: "",
    }));
    setFloors([]);
    setAreas([]);
    setNiches([]);
    try {
      const response = await axiosInstance.get(
        `/api/Locations/floors/${buildingId}`
      );
      setFloors(response.data.$values);
    } catch (error) {
      toast.error("Không thể tải danh sách tầng");
    }
  };

  const handleFloorChange = async (event: SelectChangeEvent<string>) => {
    const floorId = event.target.value as string;
    setFormData((prevData) => ({
      ...prevData,
      floorId,
      areaId: "",
      nicheId: "",
    }));
    setAreas([]);
    setNiches([]);
    try {
      const response = await axiosInstance.get(
        `/api/Locations/areas/${floorId}`
      );
      setAreas(response.data.$values);
    } catch (error) {
      toast.error("Không thể tải danh sách khu");
    }
  };

  const handleAreaChange = async (event: SelectChangeEvent<string>) => {
    const areaId = event.target.value as string;
    setFormData((prevData) => ({ ...prevData, areaId, nicheId: "" }));
    setNiches([]);
    try {
      const response = await axiosInstance.get(
        `/api/Locations/niches/${areaId}`
      );
      const availableNiches = response.data.$values.filter(
        (niche: { status: string }) => niche.status === "Available"
      );
      setNiches(availableNiches);
    } catch (error) {
      toast.error("Không thể tải danh sách ô chứa");
    }
  };

  const handleUpdate = async () => {
    try {
      await NicheReservationAPI.updateNicheReservation(
        bookingRequest.reservationId,
        formData
      );
      toast.success("Đã cập nhật đơn đăng ký đặt chỗ thành công");
      onUpdateSuccess(); // Fetch the updated list
      onClose(); // Close the dialog
    } catch (error) {
      toast.error("Không thể cập nhật đơn đăng ký đặt chỗ");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật đơn đăng ký đặt chỗ</DialogTitle>
      <DialogContent>
        {bookingRequest && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Tên khách hàng"
                type="text"
                fullWidth
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Số điện thoại"
                type="text"
                fullWidth
                variant="outlined"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>Nhà</InputLabel>
                <Select
                  name="buildingId"
                  value={formData.buildingId}
                  onChange={handleBuildingChange}
                  label="Nhà"
                >
                  {buildings.map((building) => (
                    <MenuItem
                      key={building.buildingId}
                      value={building.buildingId}
                    >
                      {building.buildingName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>Tầng</InputLabel>
                <Select
                  name="floorId"
                  value={formData.floorId}
                  onChange={handleFloorChange}
                  label="Tầng"
                  disabled={!formData.buildingId}
                >
                  {floors.map((floor) => (
                    <MenuItem key={floor.floorId} value={floor.floorId}>
                      {floor.floorName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>Khu</InputLabel>
                <Select
                  name="areaId"
                  value={formData.areaId}
                  onChange={handleAreaChange}
                  label="Khu"
                  disabled={!formData.floorId}
                >
                  {areas.map((area) => (
                    <MenuItem key={area.areaId} value={area.areaId}>
                      {area.areaName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel>Ô chứa</InputLabel>
                <Select
                  name="nicheId"
                  value={formData.nicheId}
                  onChange={(event: SelectChangeEvent<string>) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      nicheId: event.target.value as string,
                    }))
                  }
                  label="Ô chứa"
                  disabled={!formData.areaId}
                >
                  {niches.map((niche) => (
                    <MenuItem key={niche.nicheId} value={niche.nicheId}>
                      {niche.nicheName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Ngày hẹn"
                type="datetime-local"
                fullWidth
                variant="outlined"
                name="confirmationDate"
                value={formData.confirmationDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" margin="dense">
                <DialogTitle>Địa chỉ ký hợp đồng</DialogTitle>
                <RadioGroup
                  name="signAddress"
                  value={formData.signAddress}
                  onChange={handleRadioChange}
                >
                  {predefinedAddresses.map((address, index) => (
                    <FormControlLabel
                      key={index}
                      value={address}
                      control={<Radio />}
                      label={address}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Ghi chú"
                type="text"
                fullWidth
                variant="outlined"
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookingRequestDialog;
