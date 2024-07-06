import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
} from "@mui/material";

const EmployeeDetail = ({ employee, onClose, open }) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chi tiết nhân viên</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>ID:</strong> {employee.employeeId}
        </Typography>
        <Typography variant="body1">
          <strong>Tên:</strong> {employee.name}
        </Typography>
        <Typography variant="body1">
          <strong>Chức vụ:</strong> {employee.position}
        </Typography>
        <Typography variant="body1">
          <strong>Phòng ban:</strong> {employee.department}
        </Typography>
        <Avatar alt={employee.name} src={employee.profilePicture} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetail;
