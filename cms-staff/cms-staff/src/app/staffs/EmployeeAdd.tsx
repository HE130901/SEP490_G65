import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EmployeeAPI from "@/services/employeeService";

const EmployeeAdd = ({ onClose, open, onAdd }) => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");

  const handleAdd = async () => {
    try {
      const newEmployee = { name, position, department };
      const response = await EmployeeAPI.createEmployee(newEmployee);
      onAdd(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm nhân viên mới</DialogTitle>
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
        <Button onClick={handleAdd} color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeAdd;
