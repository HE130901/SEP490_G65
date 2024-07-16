import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EmployeeAPI from "@/services/employeeService";

const EmployeeEdit = ({ employee, onClose, open, onSave }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setPosition(employee.position);
      setDepartment(employee.department);
    }
  }, [employee]);

  const handleSave = async () => {
    try {
      const updatedEmployee = { ...employee, name, position, department };
      await EmployeeAPI.updateEmployee(employee.employeeId, updatedEmployee);
      onSave(updatedEmployee);
    } catch (error) {
      console.error(error);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chức vụ"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phòng ban"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSave} color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeEdit;
