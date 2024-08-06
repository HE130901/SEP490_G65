"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import ServiceAPI from "@/services/serviceService";
import { useToast } from "@/components/ui/use-toast";
import { Service } from "./interfaces";
import ImageUploadDialog from "./ImageUploadDialog";
import Image from "next/image";

interface ServiceAddProps {
  open: boolean;
  onClose: () => void;
  onAdd: (service: Service) => void;
}

const ServiceAdd: React.FC<ServiceAddProps> = ({ open, onClose, onAdd }) => {
  const { control, handleSubmit, reset, setValue, watch } = useForm<Service>({
    defaultValues: {
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
  const { toast } = useToast();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const servicePictureUrl = watch("servicePicture");

  const onSubmit: SubmitHandler<Service> = async (data) => {
    try {
      const response = await ServiceAPI.addService(data);
      toast({
        variant: "default",
        title: "Thành công",
        description: "Thêm mới dịch vụ thành công",
      });
      onAdd(response.data);
      onClose();
      reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Thêm mới dịch vụ thất bại",
      });
    }
  };

  const handleImageDialogClose = (imageUrl?: string) => {
    setImageDialogOpen(false);
    if (imageUrl) {
      setValue("servicePicture", imageUrl); // Cập nhật URL ảnh vào form
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm dịch vụ mới</DialogTitle>
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
                <Typography variant="subtitle1" gutterBottom>
                  Hình ảnh dịch vụ
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
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
          >
            Thêm
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

export default ServiceAdd;
