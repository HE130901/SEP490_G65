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

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NicheReservationAPI from "@/services/nicheReservationService";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { z } from "zod";

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
];

const formSchema = z.object({
  buildingId: z.string().nonempty("Vui lòng chọn nhà"),
  floorId: z.string().nonempty("Vui lòng chọn tầng"),
  areaId: z.string().nonempty("Vui lòng chọn khu"),
  nicheId: z.string().nonempty("Vui lòng chọn ô chứa"),
  name: z.string().nonempty("Tên khách hàng không được để trống"),
  phoneNumber: z
    .string()
    .nonempty("Số điện thoại không được để trống")
    .regex(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
  confirmationDate: z.string(),
  signAddress: z.string().nonempty(),
  note: z.string().optional(),
});

const AddBookingRequestDialog = ({
  open,
  onClose,
  onAddSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    buildingId: "",
    floorId: "",
    areaId: "",
    nicheId: "",
    name: "",
    confirmationDate: new Date().toISOString(),
    signAddress: predefinedAddresses[0], // Default to the first address
    phoneNumber: "",
    note: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const handleAdd = async () => {
    try {
      formSchema.parse(formData);
      await NicheReservationAPI.createNicheReservation(formData);
      toast.success("Đã thêm đơn đăng ký đặt chỗ mới");
      onAddSuccess(); // Fetch the updated list
      onClose(); // Close the dialog
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          errors[err.path[0] as string] = err.message;
        });
        setFormErrors(errors);
      } else {
        toast.error("Không thể thêm đơn đăng ký đặt chỗ");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm mới đơn đăng ký đặt chỗ</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Tên khách hàng *"
              type="text"
              fullWidth
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Số điện thoại *"
              type="text"
              fullWidth
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
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
                error={!!formErrors.buildingId}
              >
                {buildings.map((building) => (
                  <MenuItem
                    key={building.buildingId}
                    value={building.buildingId.toString()}
                  >
                    {building.buildingName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.buildingId && (
                <p style={{ color: "red" }}>{formErrors.buildingId}</p>
              )}
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
                error={!!formErrors.floorId}
              >
                {floors.map((floor) => (
                  <MenuItem
                    key={floor.floorId}
                    value={floor.floorId.toString()}
                  >
                    {floor.floorName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.floorId && (
                <p style={{ color: "red" }}>{formErrors.floorId}</p>
              )}
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
                error={!!formErrors.areaId}
              >
                {areas.map((area) => (
                  <MenuItem key={area.areaId} value={area.areaId.toString()}>
                    {area.areaName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.areaId && (
                <p style={{ color: "red" }}>{formErrors.areaId}</p>
              )}
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
                    nicheId: event.target.value,
                  }))
                }
                label="Ô chứa"
                disabled={!formData.areaId}
                error={!!formErrors.nicheId}
              >
                {niches.map((niche) => (
                  <MenuItem
                    key={niche.nicheId}
                    value={niche.nicheId.toString()}
                  >
                    {niche.nicheName}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.nicheId && (
                <p style={{ color: "red" }}>{formErrors.nicheId}</p>
              )}
            </FormControl>
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
              label="Ngày hẹn"
              type="datetime-local"
              fullWidth
              variant="outlined"
              name="confirmationDate"
              value={formData.confirmationDate}
              onChange={handleChange}
              error={!!formErrors.confirmationDate}
              helperText={formErrors.confirmationDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>

        <Button
          onClick={handleAdd}
          color="primary"
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
        >
          Thêm mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBookingRequestDialog;
