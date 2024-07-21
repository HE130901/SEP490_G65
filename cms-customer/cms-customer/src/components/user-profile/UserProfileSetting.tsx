// src/components/UserProfileSetting.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { z } from "zod";
import vietnamAddress from "@/assets/vietnamAddress.json"; // Load the JSON file

const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    newPassword: z
      .string()
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword === data.oldPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu mới phải khác mật khẩu cũ",
        path: ["newPassword"],
      });
    }
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

const UserProfileSetting: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user profile details and populate formData here
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "province") {
      const selectedProvince = vietnamAddress.find((p) => p.Id === value);
      setDistricts(selectedProvince?.Districts || []);
      setWards([]);
    } else if (name === "district") {
      const selectedDistrict = districts.find((d) => d.Id === value);
      setWards(selectedDistrict?.Wards || []);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmitPasswordChange = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      passwordSchema.parse(formData);
      setErrors({});

      try {
        await axiosInstance.post("/api/Auth/change-password", {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        });
        toast.success("Đổi mật khẩu thành công");
        setFormData({
          ...formData,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        toast.error("Mật khẩu cũ không đúng");
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const fieldErrors = validationError.flatten().fieldErrors;
        const newErrors: Record<string, string> = {};
        Object.keys(fieldErrors).forEach((field) => {
          if (fieldErrors[field]) {
            newErrors[field] = fieldErrors[field]![0];
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleSubmitProfileUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await axiosInstance.put("/api/CustomerProfile", {
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
      });
      toast.success("Cập nhật thông tin cá nhân thành công");
    } catch (error) {
      toast.error("Cập nhật thông tin cá nhân thất bại");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Typography variant="h5" gutterBottom>
            Thông tin cá nhân
          </Typography>
          <form onSubmit={handleSubmitProfileUpdate}>
            <TextField
              margin="normal"
              fullWidth
              label="Họ và Tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
              required
              disabled
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.address}
              helperText={errors.address}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="province-label">Tỉnh/Thành</InputLabel>
              <Select
                labelId="province-label"
                name="province"
                value={formData.province}
                onChange={handleSelectChange}
                label="Tỉnh/Thành"
              >
                {vietnamAddress.map((province) => (
                  <MenuItem key={province.Id} value={province.Id}>
                    {province.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="district-label">Quận/Huyện</InputLabel>
              <Select
                labelId="district-label"
                name="district"
                value={formData.district}
                onChange={handleSelectChange}
                label="Quận/Huyện"
                disabled={!formData.province}
              >
                {districts.map((district) => (
                  <MenuItem key={district.Id} value={district.Id}>
                    {district.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="ward-label">Phường/Xã</InputLabel>
              <Select
                labelId="ward-label"
                name="ward"
                value={formData.ward}
                onChange={handleSelectChange}
                label="Phường/Xã"
                disabled={!formData.district}
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.Id} value={ward.Id}>
                    {ward.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Lưu thay đổi
              </Button>
            </Box>
          </form>
          <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
            Đổi mật khẩu
          </Typography>
          <form onSubmit={handleSubmitPasswordChange}>
            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu cũ"
              type={showPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu mới"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Xác nhận mật khẩu mới"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Cập nhật mật khẩu
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default UserProfileSetting;
