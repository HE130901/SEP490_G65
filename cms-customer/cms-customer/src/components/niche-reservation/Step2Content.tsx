import React from "react";
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
  const phoneNumber = getValues("phoneNumber");

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Số điện thoại: {phoneNumber}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={9}>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={
                  <span>
                    Mã OTP <span style={{ color: "red" }}>*</span>
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
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            onClick={sendOtp}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#FB8C00",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#EF6C00" },
              height: "54px", // match the height of the TextField
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Gửi OTP"}
          </Button>
        </Grid>
      </Grid>
      <Button
        onClick={verifyOtp}
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          backgroundColor: "#FB8C00",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#EF6C00" },
        }}
        disabled={!otpSent || isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Xác thực OTP"}
      </Button>
    </>
  );
};

export default Step2Content;
