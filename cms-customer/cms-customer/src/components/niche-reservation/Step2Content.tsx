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
  let phoneNumber = getValues("phoneNumber");
  const name = getValues("name");

  const handleSendOtp = () => {
    // Kiểm tra nếu số điện thoại không bắt đầu với +84 thì thêm vào
    if (!phoneNumber.startsWith("+84")) {
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "+84" + phoneNumber.slice(1); // Bỏ số 0 đầu tiên và thêm +84
      } else {
        phoneNumber = "+84" + phoneNumber; // Thêm +84 trực tiếp
      }
    }

    // Gọi hàm sendOtp với số điện thoại đã chuẩn hóa
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
