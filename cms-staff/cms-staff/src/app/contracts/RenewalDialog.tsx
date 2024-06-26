import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const calculateNewEndDate = (startDate, duration, type) => {
  if (!startDate) return "";
  const date = new Date(startDate);
  if (type === "Gửi theo tháng") {
    date.setMonth(date.getMonth() + parseInt(duration, 10));
  } else if (type === "Gửi theo năm") {
    date.setFullYear(date.getFullYear() + parseInt(duration, 10));
  }
  return date.toISOString().split("T")[0];
};

const RenewalDialog = ({ open, handleClose, contract, handleSave }) => {
  const [duration, setDuration] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [type, setType] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const handleDurationChange = (event) => {
    const value = event.target.value;
    setDuration(value);
    setNewEndDate(calculateNewEndDate(renewalDate, value, type));
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;
    setType(value);
    setNewEndDate(calculateNewEndDate(renewalDate, duration, value));
  };

  const handleRenewalDateChange = (event) => {
    const value = event.target.value;
    setRenewalDate(value);
    setNewEndDate(calculateNewEndDate(value, duration, type));
  };

  const handleSubmit = () => {
    const updatedContract = {
      ...contract,
      endDate: newEndDate,
      notes: contract.notes
        ? [
            ...contract.notes,
            `Gia hạn thêm ${duration} ${
              type === "Gửi theo tháng" ? "tháng" : "năm"
            } đến ${newEndDate}`,
          ]
        : [
            `Gia hạn thêm ${duration} ${
              type === "Gửi theo tháng" ? "tháng" : "năm"
            } đến ${newEndDate}`,
          ],
      status: "Còn hiệu lực",
    };
    handleSave(updatedContract);
  };

  if (!contract) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Gia hạn hợp đồng</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} paddingTop={1}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Loại hình hợp đồng</InputLabel>
              <Select
                value={type}
                onChange={handleTypeChange}
                label="Loại hình hợp đồng"
              >
                <MenuItem value="Gửi theo tháng">Gửi theo tháng</MenuItem>
                <MenuItem value="Gửi theo năm">Gửi theo năm</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Thời gian gia hạn"
              type="number"
              fullWidth
              value={duration}
              onChange={handleDurationChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ngày gia hạn"
              type="date"
              fullWidth
              value={renewalDate}
              onChange={handleRenewalDateChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={3} p={2} border={1} borderColor="divider" borderRadius={4}>
              <Typography variant="h6" gutterBottom>
                Ngày kết thúc mới
              </Typography>
              <Divider />
              <Typography variant="body1" style={{ marginTop: 16 }}>
                {newEndDate || "Chưa xác định"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box mt={3} p={2} border={1} borderColor="divider" borderRadius={4}>
              <Typography variant="h6" gutterBottom>
                Ghi chú hiện tại
              </Typography>
              <Divider />
              {contract.notes && contract.notes.length > 0 ? (
                contract.notes.map((note, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    style={{ marginTop: 8 }}
                  >
                    - {note}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" style={{ marginTop: 8 }}>
                  Không có ghi chú.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenewalDialog;
