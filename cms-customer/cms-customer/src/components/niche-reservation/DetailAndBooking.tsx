"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Stepper,
  Step,
  StepButton,
  Button,
  CircularProgress,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { useStateContext } from "@/context/StateContext";
import OTPVerificationAPI from "@/services/otpVerificationService";
import NicheReservationAPI from "@/services/nicheReservationService";
import Step0Content from "./Step0Content";
import Step1Content from "./Step1Content";
import { schema, calculateCost, getAllowedDates } from "./utils";
import { formatVND } from "@/utils/formatCurrency";
import Step2Content from "./Step2Content";

const getSteps = (isUser: boolean) =>
  isUser
    ? ["Xem thông tin ô chứa", "Điền thông tin"]
    : ["Xem thông tin ô chứa", "Điền thông tin", "Xác thực"];
const CombinedDialog = ({
  isVisible,
  onClose,
  selectedNiche,
}: {
  isVisible: boolean;
  onClose: () => void;
  selectedNiche: any;
}) => {
  const { selectedBuilding, selectedFloor, selectedArea, user } =
    useStateContext();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const steps = getSteps(!!user);

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      type: "Gửi theo tháng",
      duration: 1,
      name: user ? user.fullName : "",
      phoneNumber: user ? user.phone : "",
      contractDate: new Date().toISOString().slice(0, 10),
      signAddress: "",
      note: "",
      otp: "",
    },
  });

  useEffect(() => {
    if (isVisible) {
      reset({
        type: "Gửi theo tháng",
        duration: 1,
        name: user ? user.fullName : "",
        phoneNumber: user ? user.phone : "",
        contractDate: new Date().toISOString().slice(0, 10),
        signAddress: "",
        note: "",
        otp: "",
      });
      setActiveStep(user ? 0 : 0);
      setOtpVerified(!!user);
      setOtpSent(false);
    }
  }, [isVisible, reset, user]);

  const handleNext = async () => {
    if (user && activeStep === 1) {
      const { signAddress, contractDate } = getValues();
      if (!signAddress || !contractDate) {
        toast.error("Vui lòng điền đầy đủ thông tin cần thiết.");
        return;
      }
      await handleSubmit(onSubmit)();
    } else if (!user && activeStep === 1) {
      if (!isValid) {
        toast.error("Vui lòng điền đầy đủ thông tin cần thiết.");
        return;
      }
      setActiveStep(2);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const sendOtp = async () => {
    const phoneNumber = getValues("phoneNumber");
    setIsLoading(true);
    try {
      await OTPVerificationAPI.sendOtp(phoneNumber);
      toast.success("OTP đã được gửi!");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otp = getValues("otp");
    const phoneNumber = getValues("phoneNumber");
    setIsLoading(true);
    try {
      await OTPVerificationAPI.verifyOtp(phoneNumber, otp);
      setOtpVerified(true);
      handleSubmit(onSubmit)();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Xác thực OTP thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedNiche?.nicheId) {
      toast.error("Vui lòng chọn một ô chứa.");
      return;
    }

    const contractDate = data.contractDate + "T23:59:59";

    const dataToSubmit = {
      nicheId: selectedNiche.nicheId,
      name: user ? user.fullName : data.name,
      confirmationDate: contractDate,
      signAddress: data.signAddress,
      phoneNumber: user ? user.phone : data.phoneNumber,
      note: data.note,
      isCustomer: !!user,
    };

    try {
      const response = await NicheReservationAPI.createReservation(
        dataToSubmit
      );
      toast.success("Đặt ô chứa thành công!");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if ((error as any).response) {
        if ((error as any).response.data.errors) {
          Object.entries((error as any).response.data.errors).forEach(
            ([key, value]) => {
              toast.error(`${key}: ${value}`);
            }
          );
        } else {
          toast.error(
            (error as any).response.data.error ||
              "Mỗi số điện thoại chỉ được đặt tối đa 3 ô chứa"
          );
        }
      } else {
        toast.error("Không thể tạo đơn đặt chỗ.");
      }
    }
  };

  const type = watch("type");
  const duration = watch("duration", 1);

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-center">
        Đăng ký đặt chỗ
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={() => setActiveStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent className="bg-gradient-to-b from-white to-stone-300">
        <form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 0 && (
            <Step0Content
              selectedNiche={selectedNiche}
              selectedBuilding={selectedBuilding}
              selectedFloor={selectedFloor}
              selectedArea={selectedArea}
              calculateCost={calculateCost}
              type={type}
              duration={duration}
              formatVND={formatVND}
              control={control}
              getAllowedDates={getAllowedDates}
              errors={errors}
            />
          )}
          {activeStep === 1 && (
            <Step1Content
              control={control}
              errors={errors}
              selectedBuilding={selectedBuilding}
              selectedFloor={selectedFloor}
              selectedArea={selectedArea}
              selectedNiche={selectedNiche}
              getAllowedDates={getAllowedDates}
              user={user}
            />
          )}
          {activeStep === 2 && !user && (
            <Step2Content
              control={control}
              errors={errors}
              sendOtp={sendOtp}
              isLoading={isLoading}
              otpSent={otpSent}
              otpVerified={otpVerified}
              verifyOtp={verifyOtp}
              getValues={getValues}
            />
          )}
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", padding: "16px" }}>
        {activeStep === 0 && (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: "#0e0101",
              color: "#0e0101",
              "&:hover": { borderColor: "#0e0101", color: "#0e0101" },
            }}
          >
            Đóng
          </Button>
        )}
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              borderColor: "#0e0101",
              color: "#0e0101",
              "&:hover": { borderColor: "#0e0101", color: "#0e0101" },
            }}
          >
            Quay lại
          </Button>
        )}
        {activeStep < (user ? 2 : steps.length - 1) && (
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{
              backgroundColor: "#FB8C00",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#EF6C00" },
            }}
          >
            {user && activeStep === 1 ? "Đặt lịch hẹn" : "Tiếp tục"}
          </Button>
        )}
        {activeStep === 2 && !user && (
          <Button
            onClick={verifyOtp}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#FB8C00",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#EF6C00" },
            }}
            disabled={!otpSent || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Xác thực OTP"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CombinedDialog;
