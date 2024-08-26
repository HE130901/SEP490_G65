import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";

const Step2Content = ({
  control,
  errors,
  sendOtp,
  isLoading,
  otpSent,
  otpVerified,
  verifyOtp,
  getValues,
}: any) => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const phoneNumber = getValues("phoneNumber");
  const name = getValues("name");

  const handleSendOtp = () => {
    // Gọi hàm sendOtp với số điện thoại đã nhập
    sendOtp(phoneNumber);
    setShowOtpInput(true);
  };

  return (
    <Grid container spacing={1} alignItems="center" justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6">Thông tin của bạn</Typography>
        <Typography>Họ và tên: {name}</Typography>
        <Typography>Số điện thoại: {phoneNumber}</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {!showOtpInput && (
          <Button
            onClick={handleSendOtp}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#FB8C00",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#EF6C00" },
              height: "40px",
              width: "200px",
              marginTop: "16px",
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Gửi OTP "}
          </Button>
        )}
        {showOtpInput && (
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={
                  <span>
                    Nhập mã OTP <span style={{ color: "red" }}>*</span>
                  </span>
                }
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#0e0101",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0e0101",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0e0101",
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0e0101",
                    },
                  width: "200px",
                  marginTop: "16px",
                }}
              />
            )}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Step2Content;
