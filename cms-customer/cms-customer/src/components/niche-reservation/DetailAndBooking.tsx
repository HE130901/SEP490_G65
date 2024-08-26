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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useStateContext } from "@/context/StateContext";
import OTPVerificationAPI from "@/services/otpVerificationService";
import NicheReservationAPI from "@/services/nicheReservationService";
import Step0Content from "./Step0Content";
import Step1Content from "./Step1Content";
import Step2Content from "./Step2Content";
import { schema, calculateCost, getAllowedDates } from "./utils";
import { formatVND } from "@/utils/formatCurrency";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      email: user ? user.email : "",
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
        email: user ? user.email : "",
        phoneNumber: user ? user.phone : "",
        contractDate: new Date().toISOString().slice(0, 10),
        signAddress: "",
        note: "",
        otp: "",
      });
      setActiveStep(0);
      setOtpVerified(!!user);
      setOtpSent(false);
      setIsSubmitting(false);
    }
  }, [isVisible, reset, user]);

  const handleNext = async () => {
    if (isSubmitting) return;

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
    if (isSubmitting) return;
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const sendOtp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const phoneNumber = getValues("phoneNumber");
    try {
      await OTPVerificationAPI.sendOtp(phoneNumber);
      toast.success("OTP đã được gửi!");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const otp = getValues("otp");
    const phoneNumber = getValues("phoneNumber");
    try {
      await OTPVerificationAPI.verifyOtp(phoneNumber, otp);
      setOtpVerified(true);
      await handleSubmit(onSubmit)();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Xác thực OTP thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!selectedNiche?.nicheId) {
      toast.error("Vui lòng chọn một ô chứa.");
      setIsSubmitting(false);
      return;
    }

    const contractDate = data.contractDate + "T23:59:59";
    const dataToSubmit = {
      nicheId: selectedNiche.nicheId,
      name: user ? user.fullName : data.name,
      confirmationDate: contractDate,
      signAddress: data.signAddress,
      phoneNumber: user ? user.phone : data.phoneNumber,
      email: user ? user.email : data.email,
      note: data.note,
      isCustomer: !!user,
    };

    try {
      await NicheReservationAPI.createReservation(dataToSubmit);
      toast.success("Đặt ô chứa thành công!");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Không thể tạo đơn đặt chỗ. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-center pb-4 font-bold">
        <strong>Đăng ký đặt chỗ</strong>
      </DialogTitle>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton
              onClick={() => setActiveStep(index)}
              disabled={isSubmitting}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <DialogContent className="bg-gradient-to-b from-white to-stone-300">
        <form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 0 && (
            <Step0Content
              selectedNiche={selectedNiche}
              control={control}
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
              isLoading={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={!otpSent || isSubmitting}
            sx={{
              backgroundColor: "#FB8C00",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#EF6C00" },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Xác thực OTP"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CombinedDialog;
