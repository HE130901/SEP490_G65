import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import ReservationSelect from "./ReservationSelect";
import { SelectChangeEvent } from "@mui/material";
import { z } from "zod";

const formatDateToYYYYMMDD = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (dateString === "N/A") return dateString;
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const calculateEndDate = (
  startDate: string,
  duration: string,
  type: string
): string => {
  if (!startDate || !duration || isNaN(parseInt(duration, 10))) return "N/A";

  const date = new Date(startDate);
  if (type === "Gửi theo tháng") {
    date.setMonth(date.getMonth() + parseInt(duration, 10));
  } else if (type === "Gửi theo năm") {
    date.setFullYear(date.getFullYear() + parseInt(duration, 10));
  }

  if (isNaN(date.getTime())) return "N/A";

  return formatDateToYYYYMMDD(date);
};

const calculateCost = (type: string, duration: number): number => {
  if (type === "Gửi theo tháng") {
    return duration * 200000;
  } else if (type === "Gửi theo năm") {
    if (duration <= 2) return 2000000;
    if (duration <= 5) return 3500000;
    if (duration <= 9) return 5000000;
    return 7000000;
  }
  return 0;
};

const step1Schema = z.object({
  customerFullName: z.string().nonempty("Tên khách hàng không được để trống"),
  customerPhoneNumber: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().email("Email không hợp lệ"),
  customerAddress: z.string().nonempty("Địa chỉ không được để trống"),
  customerCitizenId: z
    .string()
    .regex(/^\d{9}|\d{12}$/, "Số CMND phải có 9 hoặc 12 ký tự"),
  customerCitizenIdIssueDate: z
    .string()
    .refine((date) => new Date(date) <= new Date(), {
      message: "Ngày cấp CMND phải nhỏ hơn hoặc bằng ngày hiện tại",
    }),
  customerCitizenIdSupplier: z
    .string()
    .nonempty("Nơi cấp CMND không được để trống"),
});

const step2Schema = z.object({
  deceasedFullName: z.string().nonempty("Tên người quá cố không được để trống"),
  deceasedCitizenId: z
    .string()
    .regex(/^\d{9}|\d{12}$/, "Số CMND phải có 9 hoặc 12 ký tự"),
  deceasedDateOfBirth: z
    .string()
    .refine((date) => new Date(date) <= new Date(), {
      message: "Ngày sinh phải nhỏ hơn hoặc bằng ngày hiện tại",
    }),
  deceasedDateOfDeath: z
    .string()
    .refine((date) => new Date(date) <= new Date(), {
      message: "Ngày mất phải nhỏ hơn hoặc bằng ngày hiện tại",
    }),
  deathCertificateNumber: z
    .string()
    .nonempty("Số chứng tử không được để trống"),
  deathCertificateSupplier: z
    .string()
    .nonempty("Nơi cấp chứng tử không được để trống"),
  relationshipWithCustomer: z
    .string()
    .nonempty("Mối quan hệ không được để trống"),
});

const step3Schema = z.object({
  startDate: z
    .string()
    .refine(
      (date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)),
      {
        message: "Ngày bắt đầu tối thiểu phải từ ngày hiện tại.",
      }
    ),
  type: z.string().nonempty("Loại hình gửi không được để trống"),
  duration: z.string().nonempty("Thời gian không được để trống"),
});

const ContractAdd: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservationCode, setSelectedReservationCode] =
    useState<string>("");
  const [contractData, setContractData] = useState({
    customerFullName: "",
    customerPhoneNumber: "",
    customerEmail: "",
    customerAddress: "",
    customerCitizenId: "",
    customerCitizenIdIssueDate: "",
    customerCitizenIdSupplier: "",
    deceasedFullName: "",
    deceasedCitizenId: "",
    deceasedDateOfBirth: "",
    deceasedDateOfDeath: "",
    deathCertificateNumber: "",
    deathCertificateSupplier: "",
    relationshipWithCustomer: "",
    nicheID: 0,
    startDate: "",
    endDate: "",
    note: "",
    totalAmount: 0,
    reservationId: 0,
  });
  const initialState = {
    customerFullName: "",
    customerPhoneNumber: "",
    customerEmail: "",
    customerAddress: "",
    customerCitizenId: "",
    customerCitizenIdIssueDate: "",
    customerCitizenIdSupplier: "",
    deceasedFullName: "",
    deceasedCitizenId: "",
    deceasedDateOfBirth: "",
    deceasedDateOfDeath: "",
    deathCertificateNumber: "",
    deathCertificateSupplier: "",
    relationshipWithCustomer: "",
    nicheID: 0,
    startDate: "",
    endDate: "",
    note: "",
    totalAmount: 0,
    reservationId: 0,
  };

  const resetForm = () => {
    setContractData(initialState);
    setSelectedReservationCode("");
    setDuration("");
    setType("");
    setNewEndDate("N/A");
    setCost(0);
    setActiveStep(0);
    setErrors({});
    setIsSubmitting(false);
  };

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/NicheReservations/approved"
      );
      setReservations(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };
  useEffect(() => {
    if (open) {
      resetForm();
      fetchReservations();
    }
  }, [open]);

  // ... (phần còn lại của component giữ nguyên)

  const handleClose = () => {
    resetForm();
    onClose();
    fetchReservations();
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Thông tin khách hàng",
    "Thông tin người đã khuất",
    "Thông tin hợp đồng",
  ];

  const [duration, setDuration] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState<string>("N/A");
  const [cost, setCost] = useState<number>(0);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/NicheReservations/approved"
        );
        setReservations(response.data.$values || []);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const handleReservationSelect = (reservationCode: string) => {
    const reservation = reservations.find(
      (res) => res.reservationCode === reservationCode
    );

    if (reservation) {
      setSelectedReservationCode(reservationCode);
      setContractData((prevState) => ({
        ...prevState,
        customerFullName: reservation.customerName || "",
        customerPhoneNumber: reservation.customerPhone || "",
        customerEmail: "",
        customerAddress: "",
        customerCitizenId: "",
        customerCitizenIdIssueDate: "",
        customerCitizenIdSupplier: "",
        deceasedFullName: "",
        deceasedCitizenId: "",
        deceasedDateOfBirth: "",
        deceasedDateOfDeath: "",
        deathCertificateNumber: "",
        deathCertificateSupplier: "",
        relationshipWithCustomer: "",
        nicheID: reservation.nicheId || 0,
        note: reservation.note || "",
        totalAmount: 0,
        reservationId: reservation.reservationId,
      }));
    }
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDuration(value);
    setContractData((prevState) => ({
      ...prevState,
      duration: value,
    }));
    if (type) {
      const newEndDate = calculateEndDate(contractData.startDate, value, type);
      const cost = calculateCost(type, parseInt(value, 10));
      setContractData((prevState) => ({
        ...prevState,
        endDate: newEndDate,
        totalAmount: cost,
      }));
      setNewEndDate(newEndDate);
      setCost(cost);
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setType(value);
    setContractData((prevState) => ({
      ...prevState,
      type: value,
    }));
    if (duration) {
      const newEndDate = calculateEndDate(
        contractData.startDate,
        duration,
        value
      );
      const cost = calculateCost(value, parseInt(duration, 10));
      setContractData((prevState) => ({
        ...prevState,
        endDate: newEndDate,
        totalAmount: cost,
      }));
      setNewEndDate(newEndDate);
      setCost(cost);
    }
  };

  const validateStep = (step: number) => {
    let schema;
    let dataToValidate;

    switch (step) {
      case 0:
        schema = step1Schema;
        dataToValidate = {
          customerFullName: contractData.customerFullName,
          customerPhoneNumber: contractData.customerPhoneNumber,
          customerEmail: contractData.customerEmail,
          customerAddress: contractData.customerAddress,
          customerCitizenId: contractData.customerCitizenId,
          customerCitizenIdIssueDate: contractData.customerCitizenIdIssueDate,
          customerCitizenIdSupplier: contractData.customerCitizenIdSupplier,
        };
        break;
      case 1:
        schema = step2Schema;
        dataToValidate = {
          deceasedFullName: contractData.deceasedFullName,
          deceasedCitizenId: contractData.deceasedCitizenId,
          deceasedDateOfBirth: contractData.deceasedDateOfBirth,
          deceasedDateOfDeath: contractData.deceasedDateOfDeath,
          deathCertificateNumber: contractData.deathCertificateNumber,
          deathCertificateSupplier: contractData.deathCertificateSupplier,
          relationshipWithCustomer: contractData.relationshipWithCustomer,
        };
        break;
      case 2:
        schema = step3Schema;
        dataToValidate = {
          startDate: contractData.startDate,
          type: type,
          duration: duration,
        };
        break;
      default:
        return true;
    }

    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      const newErrors = result.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setContractData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Starting contract submission...");

    try {
      setIsSubmitting(true);
      console.log("Sending request to create contract...");
      const response = await axiosInstance.post(
        "/api/ContractForStaff/create-contract",
        contractData
      );
      console.log("Contract creation response:", response);

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202 ||
        response.status === 203 ||
        response.status === 204
      ) {
        console.log("Contract created successfully.");

        toast.success("Hợp đồng đã được tạo thành công!");
        onClose();
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (error: any) {
      console.error("Error during contract submission:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(
          "Đã xảy ra lỗi khi tạo hợp đồng. Vui lòng kiểm tra dữ liệu và thử lại."
        );
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                name="customerFullName"
                value={contractData.customerFullName}
                onChange={handleChange}
                error={!!errors.customerFullName}
                helperText={errors.customerFullName}
                placeholder="Nhập tên đầy đủ của khách hàng"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại khách hàng"
                name="customerPhoneNumber"
                value={contractData.customerPhoneNumber}
                onChange={handleChange}
                error={!!errors.customerPhoneNumber}
                helperText={errors.customerPhoneNumber}
                placeholder="Nhập số điện thoại của khách hàng"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email khách hàng"
                name="customerEmail"
                value={contractData.customerEmail}
                onChange={handleChange}
                error={!!errors.customerEmail}
                helperText={errors.customerEmail}
                placeholder="Nhập email của khách hàng"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Địa chỉ khách hàng"
                name="customerAddress"
                value={contractData.customerAddress}
                onChange={handleChange}
                error={!!errors.customerAddress}
                helperText={errors.customerAddress}
                placeholder="Nhập địa chỉ của khách hàng"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số CMND khách hàng"
                name="customerCitizenId"
                value={contractData.customerCitizenId}
                onChange={handleChange}
                error={!!errors.customerCitizenId}
                helperText={errors.customerCitizenId}
                placeholder="Nhập số CMND của khách hàng"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày cấp CMND"
                type="date"
                name="customerCitizenIdIssueDate"
                value={contractData.customerCitizenIdIssueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.customerCitizenIdIssueDate}
                helperText={errors.customerCitizenIdIssueDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nơi cấp CMND"
                name="customerCitizenIdSupplier"
                value={contractData.customerCitizenIdSupplier}
                onChange={handleChange}
                error={!!errors.customerCitizenIdSupplier}
                helperText={errors.customerCitizenIdSupplier}
                placeholder="Nhập nơi cấp CMND"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên người quá cố"
                name="deceasedFullName"
                value={contractData.deceasedFullName}
                onChange={handleChange}
                error={!!errors.deceasedFullName}
                helperText={errors.deceasedFullName}
                placeholder="Nhập tên đầy đủ của người quá cố"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số CMND người quá cố"
                name="deceasedCitizenId"
                value={contractData.deceasedCitizenId}
                onChange={handleChange}
                error={!!errors.deceasedCitizenId}
                helperText={errors.deceasedCitizenId}
                placeholder="Nhập số CMND của người quá cố"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh người quá cố"
                type="date"
                name="deceasedDateOfBirth"
                value={contractData.deceasedDateOfBirth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.deceasedDateOfBirth}
                helperText={errors.deceasedDateOfBirth}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày mất người quá cố"
                type="date"
                name="deceasedDateOfDeath"
                value={contractData.deceasedDateOfDeath}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.deceasedDateOfDeath}
                helperText={errors.deceasedDateOfDeath}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số chứng tử"
                name="deathCertificateNumber"
                value={contractData.deathCertificateNumber}
                onChange={handleChange}
                error={!!errors.deathCertificateNumber}
                helperText={errors.deathCertificateNumber}
                placeholder="Nhập số chứng tử"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nơi cấp chứng tử"
                name="deathCertificateSupplier"
                value={contractData.deathCertificateSupplier}
                onChange={handleChange}
                error={!!errors.deathCertificateSupplier}
                helperText={errors.deathCertificateSupplier}
                placeholder="Nhập nơi cấp chứng tử"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.relationshipWithCustomer}>
                <InputLabel>Mối quan hệ với khách hàng</InputLabel>
                <Select
                  name="relationshipWithCustomer"
                  value={contractData.relationshipWithCustomer}
                  onChange={handleChange}
                  label="Mối quan hệ với khách hàng"
                >
                  <MenuItem value="Cụ">Cụ</MenuItem>
                  <MenuItem value="Ông/Bà">Ông/Bà</MenuItem>
                  <MenuItem value="Cha/Mẹ">Cha/Mẹ</MenuItem>
                  <MenuItem value="Con">Con</MenuItem>
                  <MenuItem value="Cháu">Cháu</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
                {errors.relationshipWithCustomer && (
                  <Typography color="error">
                    {errors.relationshipWithCustomer}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                type="date"
                name="startDate"
                value={contractData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Loại hình gửi</InputLabel>
                <Select
                  value={type}
                  onChange={handleTypeChange}
                  label="Loại hình gửi"
                >
                  <MenuItem value="Gửi theo tháng">Gửi theo tháng</MenuItem>
                  <MenuItem value="Gửi theo năm">Gửi theo năm</MenuItem>
                </Select>
                {errors.type && (
                  <Typography color="error">{errors.type}</Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thời gian (tháng hoặc năm)"
                type="number"
                value={duration}
                onChange={handleDurationChange}
                error={!!errors.duration}
                helperText={errors.duration}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Ngày kết thúc:</strong>{" "}
                {formatDateToDDMMYYYY(newEndDate)}
              </Typography>
              <Typography variant="body1">
                <strong>Chi phí:</strong> {cost.toLocaleString()} VND
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="note"
                value={contractData.note}
                onChange={handleChange}
                placeholder="Nhập ghi chú (nếu có)"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Thêm Hợp Đồng</DialogTitle>
      <DialogContent dividers>
        <ReservationSelect
          reservations={reservations}
          selectedReservationCode={selectedReservationCode}
          onSelect={handleReservationSelect}
        />
        <Box sx={{ mt: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {handleStepContent(activeStep)}
        </Box>
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && (
          <Button onClick={handleBack} variant="outlined">
            Quay lại
          </Button>
        )}
        <Button
          onClick={handleNext}
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          {activeStep === steps.length - 1 ? "Tạo hợp đồng" : "Tiếp theo"}
          {isSubmitting && (
            <CircularProgress size={24} sx={{ marginLeft: 2 }} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractAdd;
