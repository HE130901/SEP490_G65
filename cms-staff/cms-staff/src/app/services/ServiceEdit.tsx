"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import ServiceAPI from "@/services/serviceService";
import { Service } from "./interfaces";
import ImageUploadDialog from "./ImageUploadDialog";
import Image from "next/image";
import { toast } from "react-toastify";

interface ServiceEditProps {
  service: Service | null;
  onClose: () => void;
  onSave: (service: Service) => void;
  open: boolean;
}

const ServiceEdit: React.FC<ServiceEditProps> = ({
  service,
  onClose,
  onSave,
  open,
}) => {
  const { control, handleSubmit, reset, setValue, watch } = useForm<Service>({
    defaultValues: service || {
      serviceId: 0,
      serviceName: "",
      description: "",
      price: 0,
      category: "",
      tag: "",
      servicePicture: "",
      status: "Available",
    },
  });
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const servicePictureUrl = watch("servicePicture");

  useEffect(() => {
    reset(
      service || {
        serviceId: 0,
        serviceName: "",
        description: "",
        price: 0,
        category: "",
        tag: "",
        servicePicture: "",
        status: "Available",
      }
    );
  }, [service, reset]);

  const onSubmit: SubmitHandler<Service> = async (data) => {
    if (!service) return;
    try {
      await ServiceAPI.updateService(service.serviceId, data);
      toast.success("Cập nhật dịch vụ thành công");
      onSave({ ...service, ...data });
      onClose();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Cập nhật dịch vụ thất bại");
    }
  };

  const handleImageDialogClose = (imageUrl?: string) => {
    setImageDialogOpen(false);
    if (imageUrl) {
      setValue("servicePicture", imageUrl);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Sửa dịch vụ</DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="serviceName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Tên dịch vụ
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Mô tả
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Giá (VND)
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="status-label">
                        Trạng thái
                        <span style={{ color: "red" }}> *</span>
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="status-label"
                        label={
                          <span>
                            Trạng thái
                            <span style={{ color: "red" }}> *</span>
                          </span>
                        }
                      >
                        <MenuItem value="Available">Sẵn sàng</MenuItem>
                        <MenuItem value="Unavailable">Đã hết hàng</MenuItem>
                        <MenuItem value="Removed">Đã ngừng bán</MenuItem>
                        <MenuItem value="Others">Khác</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Phân loại
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      fullWidth
                      variant="outlined"
                      select
                    >
                      <MenuItem value="Sản phẩm">Sản phẩm</MenuItem>
                      <MenuItem value="Dịch vụ">Dịch vụ</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <span>
                          Thẻ
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      fullWidth
                      variant="outlined"
                      select
                    >
                      <MenuItem value="Combo">Combo</MenuItem>
                      <MenuItem value="Hoa quả">Hoa quả</MenuItem>
                      <MenuItem value="Gói lễ">Gói lễ</MenuItem>
                      <MenuItem value="Đồ cúng viếng">Đồ cúng viếng</MenuItem>
                      <MenuItem value="Dịch vụ">Dịch vụ</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  <span>
                    Hình ảnh dịch vụ
                    <span style={{ color: "red" }}> *</span>
                  </span>
                </Typography>
                <Box display="flex" alignItems="center">
                  <Button
                    variant="contained"
                    onClick={() => setImageDialogOpen(true)}
                  >
                    Chọn ảnh
                  </Button>
                </Box>
                {servicePictureUrl && (
                  <Box mt={2} textAlign="center">
                    <Image
                      src={servicePictureUrl}
                      alt="Preview"
                      style={{ maxHeight: 200, borderRadius: 8 }}
                      width={200}
                      height={200}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <ImageUploadDialog
        open={imageDialogOpen}
        onClose={handleImageDialogClose}
        onImageUpload={handleImageDialogClose}
      />
    </>
  );
};

export default ServiceEdit;
