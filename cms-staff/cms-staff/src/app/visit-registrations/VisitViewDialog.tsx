import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { VisitDialogProps, VisitRegistrationDto } from "./interfaces";
import dayjs from "dayjs";

import EditIcon from "@mui/icons-material/Edit";

const VisitViewDialog: React.FC<VisitDialogProps> = ({
  open,
  visit,
  onClose,
}) => {
  const [formData, setFormData] = useState<VisitRegistrationDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (visit) {
      setFormData({ ...visit });
      setIsEditMode(false); // Reset edit mode when a new visit is loaded
    }
  }, [visit]);

  function formatDateTime(dateTimeString: any) {
    return dayjs(dateTimeString).format("YYYY-MM-DDTHH:mm"); // Format for TextField
  }

  function formatDisplayDateTime(dateTimeString: any) {
    return dayjs(dateTimeString).format("HH:mm DD/MM/YYYY"); // Format for display
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Canceled":
        return { label: "Đã hủy", color: "error" };
      case "Expired":
        return { label: "Đã hết hạn", color: "error" };
      case "Pending":
        return { label: "Đang chờ", color: "warning" };
      case "Approved":
        return { label: "Đã duyệt", color: "success" };
      default:
        return { label: status, color: "default" };
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleSave = async () => {
    if (formData) {
      try {
        await axiosInstance.put(
          `/api/VisitRegistrations/${formData.visitId}`,
          formData
        );
        toast.success("Đơn đăng ký viếng thăm đã được cập nhật thành công");
        onClose();
      } catch (error) {
        toast.error("Không thể cập nhật đơn đăng ký viếng thăm");
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode
          ? "Chỉnh sửa đơn đăng ký viếng thăm"
          : "Xem đơn đăng ký viếng thăm"}
      </DialogTitle>
      <DialogContent dividers>
        {formData && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Mã đơn"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.visitCode}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Tên khách hàng"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.customerName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Địa chỉ"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.nicheAddress}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Ngày tạo"
                type="text"
                fullWidth
                variant="outlined"
                value={formatDisplayDateTime(formData.createdDate)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Ngày viếng thăm"
                type="text"
                fullWidth
                variant="outlined"
                value={formatDisplayDateTime(formData.visitDate)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {isEditMode ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Ngày viếng thăm"
                    type="datetime-local"
                    fullWidth
                    variant="outlined"
                    name="visitDate"
                    value={formatDateTime(formData.visitDate)}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    label="Số lượng người đi cùng"
                    type="number"
                    fullWidth
                    variant="outlined"
                    name="accompanyingPeople"
                    value={formData.accompanyingPeople}
                    onChange={handleChange}
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
                    value={formData.note || "Không có ghi chú"}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Số lượng người đi cùng:</strong>{" "}
                    {formData.accompanyingPeople}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Trạng thái:</strong>{" "}
                    <Chip
                      label={getStatusLabel(formData.status).label}
                      color={getStatusLabel(formData.status).color as any}
                    />
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    label="Ghi chú"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="note"
                    value={formData.note || "Không có ghi chú"}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        {isEditMode ? (
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        ) : (
          <Button
            onClick={toggleEditMode}
            variant="contained"
            disabled={formData?.status !== "Pending"}
            startIcon={<EditIcon />}
          >
            Sửa
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VisitViewDialog;
