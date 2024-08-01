"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { z } from "zod";

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
    citizenId: "",
    citizenIdissuanceDate: "",
    citizenIdsupplier: "",
  });

  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/CustomerProfile");
        const data = response.data;
        setFormData((prevData) => ({
          ...prevData,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          citizenId: data.citizenId,
          citizenIdissuanceDate: data.citizenIdissuanceDate,
          citizenIdsupplier: data.citizenIdsupplier,
        }));
      } catch (error) {
        toast.error("Failed to fetch user profile");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [day, month, year] = value.split("/");
    const formattedValue = `${year}-${month}-${day}`;
    setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
  };

  const handleClickShowPassword = (field: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        citizenId: formData.citizenId,
        citizenIdissuanceDate: formData.citizenIdissuanceDate,
        citizenIdsupplier: formData.citizenIdsupplier,
      });
      toast.success("Cập nhật thông tin cá nhân thành công");
      setIsEditing(false);
    } catch (error) {
      toast.error("Cập nhật thông tin cá nhân thất bại");
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  return (
    <Grid container style={{ minHeight: "100vh" }} spacing={2}>
      <Grid item xs={12} md={6}>
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
            />
            <Grid container spacing={2}>
              <Grid item md={4} sm={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Số CMND"
                  name="citizenId"
                  value={formData.citizenId}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item md={4} sm={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Ngày cấp"
                  name="citizenIdissuanceDate"
                  value={formatDisplayDate(formData.citizenIdissuanceDate)}
                  onChange={handleDateChange}
                  variant="outlined"
                  required
                  placeholder="dd/mm/yyyy"
                />
              </Grid>
              <Grid item md={4} sm={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Nơi cấp"
                  name="citizenIdsupplier"
                  value={formData.citizenIdsupplier}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>
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
            {isEditing && (
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
            )}
          </form>
          {!isEditing && (
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={enableEditing}
              >
                Sửa
              </Button>
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Typography variant="h5" gutterBottom>
            Đổi mật khẩu
          </Typography>
          <form onSubmit={handleSubmitPasswordChange}>
            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu cũ"
              type={showPassword.oldPassword ? "text" : "password"}
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
                      onClick={() => handleClickShowPassword("oldPassword")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.oldPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Mật khẩu mới"
              type={showPassword.newPassword ? "text" : "password"}
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
                      onClick={() => handleClickShowPassword("newPassword")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.newPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Xác nhận mật khẩu mới"
              type={showPassword.confirmPassword ? "text" : "password"}
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
                      onClick={() => handleClickShowPassword("confirmPassword")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.confirmPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
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
