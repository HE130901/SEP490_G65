// src/services/otpVerificationService.js
import axiosInstance from "@/utils/axiosInstance";

const API_URL = '/api/Otp';

// Real OTP functions

// const sendOtp = async (phoneNumber: any) => {
//   const response = await axiosInstance.post(`${API_URL}/send-otp`, { phoneNumber });
//   return response.data;
// };

// const verifyOtp = async (phoneNumber: any, otp: any) => {
//   const response = await axiosInstance.post(`${API_URL}/verify-otp`, { phoneNumber, otp });
//   return response.data;
// };


// Fake OTP functions for testing
const sendOtp = async (phoneNumber: any) => {
  const response = await axiosInstance.post(`${API_URL}/test/send-otp`, { phoneNumber });
  return response.data;
};

const verifyOtp = async (phoneNumber: any, otp: any) => {
  const response = await axiosInstance.post(`${API_URL}/test/verify-otp`, { phoneNumber, otp });
  return response.data;
};

const OTPVerificationAPI = {
  sendOtp,
  verifyOtp,
};

export default OTPVerificationAPI;
