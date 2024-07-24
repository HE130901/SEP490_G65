import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { VisitDialogProps, VisitRegistrationDto } from "./interfaces";

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
          <>
            <Typography variant="body1" gutterBottom>
              <strong>Mã đơn:</strong> {formData.visitId}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Tên khách hàng:</strong> {formData.customerName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Địa chỉ:</strong> {formData.nicheAddress}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Ngày tạo:</strong> {formData.formattedCreatedDate}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Ngày viếng thăm:</strong> {formData.formattedVisitDate}
            </Typography>

            {isEditMode ? (
              <>
                <TextField
                  margin="dense"
                  label="Ngày viếng thăm"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
              </>
            ) : (
              <>
                <Typography variant="body1" gutterBottom>
                  <strong>Trạng thái:</strong> {formData.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Số lượng người đi cùng:</strong>{" "}
                  {formData.accompanyingPeople}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Ghi chú:</strong> {formData.note}
                </Typography>
              </>
            )}
            <Typography variant="body1" gutterBottom>
              <strong>Nhân viên tiếp nhận:</strong> {formData.staffName}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
        {isEditMode ? (
          <>
            <Button onClick={handleSave} variant="contained">
              Lưu
            </Button>
          </>
        ) : (
          <Button
            onClick={toggleEditMode}
            variant="contained"
            disabled={formData?.status === "Canceled"}
          >
            Chỉnh sửa
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VisitViewDialog;
