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
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import ServiceAPI from "@/services/serviceService";
import { useToast } from "@/components/ui/use-toast";
import { Service } from "./interfaces";
import ImageUploadDialog from "./ImageUploadDialog";
import Image from "next/image";

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
    },
  });
  const { toast } = useToast();
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
      }
    );
  }, [service, reset]);

  const onSubmit: SubmitHandler<Service> = async (data) => {
    if (!service) return;
    try {
      await ServiceAPI.updateService(service.serviceId, data);
      toast({
        variant: "default",
        title: "Thành công",
        description: "Cập nhật dịch vụ thành công",
      });
      onSave({ ...service, ...data });
      onClose();
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Cập nhật dịch vụ thất bại",
      });
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
      <Dialog open={open} onClose={onClose}>
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
                      label="Tên dịch vụ"
                      fullWidth
                      variant="outlined"
                      required
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
                      label="Mô tả"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={4}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Giá (VNĐ)"
                      type="number"
                      fullWidth
                      variant="outlined"
                      required
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phân loại"
                      fullWidth
                      variant="outlined"
                      select
                      required
                    >
                      <MenuItem value="Sản phẩm">Sản phẩm</MenuItem>
                      <MenuItem value="Dịch vụ">Dịch vụ</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Thẻ"
                      fullWidth
                      variant="outlined"
                      select
                      required
                    >
                      <MenuItem value="Combo">Combo</MenuItem>
                      <MenuItem value="Hoa quả">Hoa quả</MenuItem>
                      <MenuItem value="Gói lễ">Gói lễ</MenuItem>
                      <MenuItem value="Đồ cúng viếng">Đồ cúng viếng</MenuItem>
                      <MenuItem value="Khác">Khác</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Trạng thái"
                      fullWidth
                      variant="outlined"
                      select
                      required
                    >
                      <MenuItem value="Available">Còn hàng</MenuItem>
                      <MenuItem value="Unavailable">Hết hàng</MenuItem>
                      <MenuItem value="Others">Khác</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Controller
                    name="servicePicture"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ảnh"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    )}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setImageDialogOpen(true)}
                    sx={{ ml: 2 }}
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
          <Button onClick={onClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary">
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
