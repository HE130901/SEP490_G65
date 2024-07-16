import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import EmployeeAPI from "@/services/employeeService";

const EmployeeDelete = ({ employee, onClose, open, onDelete }) => {
  const handleDelete = async () => {
    try {
      await EmployeeAPI.deleteEmployee(employee.employeeId);
      onDelete(employee.employeeId);
    } catch (error) {
      console.error(error);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xóa nhân viên</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xóa nhân viên này?</Typography>
        <Typography>
          <strong>ID:</strong> {employee.employeeId}
        </Typography>
        <Typography>
          <strong>Tên:</strong> {employee.name}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDelete;
