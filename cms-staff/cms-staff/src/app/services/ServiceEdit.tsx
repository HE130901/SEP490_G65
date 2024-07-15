"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import ServiceAPI from "@/services/serviceService";
import { useToast } from "@/components/ui/use-toast";
import { Service } from "./interfaces";

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
  const { control, handleSubmit, reset } = useForm<Service>({
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

  React.useEffect(() => {
    return reset(
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

  return (
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
                    label="Giá"
                    type="number"
                    fullWidth
                    variant="outlined"
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
                  />
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="servicePicture"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ảnh URL"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
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
  );
};

export default ServiceEdit;
