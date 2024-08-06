"use client";

import NicheReservationAPI from "@/services/nicheReservationService";
import axiosInstance from "@/utils/axiosInstance";
import { CheckCircle as ConfirmIcon } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
  confirmationDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Ngày hẹn phải là ngày hiện tại trở đi"),
  signAddress: z.string().nonempty(),
  note: z.string().max(300, "Ghi chú không được vượt quá 300 ký tự").optional(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    buildingId: "",
    floorId: "",
    areaId: "",
    nicheId: "",
    name: "",
    confirmationDate: new Date().toISOString().substring(0, 16), // Format to "yyyy-MM-ddThh:mm"
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
    { nicheId: string; nicheName: string; status: string }[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, signAddress: e.target.value }));
  };

  const validateField = (name: string, value: string) => {
    try {
      (formSchema.shape as Record<string, z.ZodType<any>>)[name].parse(value);
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error.errors[0].message,
        }));
      }
    }
  };

  useEffect(() => {
    if (open) {
      const fetchBuildings = async () => {
        try {
          const response = await axiosInstance.get("/api/Locations/buildings");
          setBuildings(response.data.$values);
        } catch (error) {
          toast.error("Không thể tải danh sách nhà");
        }
      };

      fetchBuildings();
    }
  }, [open]);

  useEffect(() => {
    const fetchFloors = async () => {
      if (formData.buildingId) {
        try {
          const response = await axiosInstance.get(
            `/api/Locations/floors/${formData.buildingId}`
          );
          setFloors(response.data.$values);
        } catch (error) {
          toast.error("Không thể tải danh sách tầng");
        }
      }
    };

    const fetchAreas = async () => {
      if (formData.floorId) {
        try {
          const response = await axiosInstance.get(
            `/api/Locations/areas/${formData.floorId}`
          );
          setAreas(response.data.$values);
        } catch (error) {
          toast.error("Không thể tải danh sách khu");
        }
      }
    };

    const fetchNiches = async () => {
      if (formData.areaId) {
        try {
          const response = await axiosInstance.get(
            `/api/Locations/niches/${formData.areaId}`
          );
          const availableNiches = response.data.$values.filter(
            (niche: { status: string }) => niche.status === "Available"
          );
          setNiches(availableNiches);
        } catch (error) {
          toast.error("Không thể tải danh sách ô chứa");
        }
      }
    };

    fetchFloors();
    fetchAreas();
    fetchNiches();
  }, [formData.buildingId, formData.floorId, formData.areaId]);

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
  };

  const handleAreaChange = async (event: SelectChangeEvent<string>) => {
    const areaId = event.target.value as string;
    setFormData((prevData) => ({ ...prevData, areaId, nicheId: "" }));
    setNiches([]);
  };

  const handleAdd = async () => {
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm mới đơn đăng ký đặt chỗ</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label={
                <span>
                  Tên khách hàng <span style={{ color: "red" }}>*</span>
                </span>
              }
              type="text"
              fullWidth
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label={
                <span>
                  Số điện thoại <span style={{ color: "red" }}>*</span>
                </span>
              }
              type="text"
              fullWidth
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense" variant="outlined">
              <InputLabel>
                <span>
                  Nhà <span style={{ color: "red" }}>*</span>
                </span>
              </InputLabel>
              <Select
                name="buildingId"
                value={formData.buildingId}
                onChange={handleBuildingChange}
                onBlur={handleBlur}
                label={
                  <span>
                    Nhà <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
              <InputLabel>
                {" "}
                <span>
                  Tầng <span style={{ color: "red" }}>*</span>
                </span>
              </InputLabel>
              <Select
                name="floorId"
                value={formData.floorId}
                onChange={handleFloorChange}
                onBlur={handleBlur}
                label={
                  <span>
                    Tầng <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
              <InputLabel>
                {" "}
                <span>
                  Khu <span style={{ color: "red" }}>*</span>
                </span>
              </InputLabel>
              <Select
                name="areaId"
                value={formData.areaId}
                onChange={handleAreaChange}
                onBlur={handleBlur}
                label={
                  <span>
                    Khu <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
              <InputLabel>
                {" "}
                <span>
                  Ô chứa <span style={{ color: "red" }}>*</span>
                </span>
              </InputLabel>
              <Select
                name="nicheId"
                value={formData.nicheId}
                onChange={(event: SelectChangeEvent<string>) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    nicheId: event.target.value,
                  }))
                }
                onBlur={handleBlur}
                label={
                  <span>
                    Ô chứa <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
              <DialogTitle>
                Địa chỉ ký hợp đồng <span style={{ color: "red" }}>*</span>
              </DialogTitle>
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
              label={
                <span>
                  Ngày hẹn <span style={{ color: "red" }}>*</span>
                </span>
              }
              type="datetime-local"
              fullWidth
              variant="outlined"
              name="confirmationDate"
              value={formData.confirmationDate}
              onChange={handleChange}
              onBlur={handleBlur}
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
              label="Ghi chú (nếu có)"
              type="text"
              fullWidth
              variant="outlined"
              name="note"
              value={formData.note}
              onChange={handleChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 300 }}
              helperText={`${formData.note.length}/300`}
              error={!!formErrors.note}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Đóng
        </Button>

        <Button
          onClick={handleAdd}
          color="primary"
          variant="contained"
          disabled={isSubmitting}
          startIcon={<ConfirmIcon />}
        >
          Thêm mới
          {isSubmitting && (
            <CircularProgress size={24} sx={{ marginLeft: 2 }} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBookingRequestDialog;
