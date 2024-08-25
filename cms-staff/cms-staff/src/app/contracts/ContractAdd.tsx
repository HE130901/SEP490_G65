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
import dayjs from "dayjs";
interface Setting {
  settingId: number;
  settingName: string;
  settingNumber: number;
  settingUnit?: string;
  settingType?: string;
}

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (dateString === "N/A") return dateString;
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
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

const step2Schema = z
  .object({
    deceasedFullName: z
      .string()
      .nonempty("Tên người quá cố không được để trống"),
    deceasedCitizenId: z
      .string()
      .regex(/^\d{9}|\d{12}$/, "Số CMND phải có 9 hoặc 12 ký tự"),
    deceasedDateOfBirth: z
      .string()
      .refine((date) => new Date(date) <= new Date(), {
        message: "Ngày sinh phải sớm hơn hoặc bằng ngày hôm nay",
      }),
    deceasedDateOfDeath: z
      .string()
      .refine((date) => new Date(date) <= new Date(), {
        message: "Ngày mất phải sớm hơn hoặc bằng ngày hôm nay",
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
  })
  .superRefine((data, ctx) => {
    const dateOfBirth = new Date(data.deceasedDateOfBirth);
    const dateOfDeath = new Date(data.deceasedDateOfDeath);
    if (dateOfDeath < dateOfBirth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deceasedDateOfDeath"],
        message: "Ngày mất phải bằng hoặc sau ngày sinh",
      });
    }
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
  duration: z.string().optional(),
});

const ContractAdd: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservationCode, setSelectedReservationCode] =
    useState<string>("");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<string>("");
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
  const calculateContractDetails = (
    startDate: string,
    settingId: string,
    duration: string
  ) => {
    const setting = settings.find((s) => s.settingId === parseInt(settingId));
    if (!setting) return { endDate: "N/A", cost: 0 };

    let cost = setting.settingNumber;
    let calculatedEndDate = dayjs(startDate);

    if (setting.settingName.includes("Gửi dưới 100 ngày")) {
      calculatedEndDate = calculatedEndDate.add(100, "days");
    } else if (setting.settingName.includes("Gửi dưới 1 năm")) {
      calculatedEndDate = calculatedEndDate.add(1, "year");
    } else {
      const durationNumber = parseInt(duration, 10);
      if (isNaN(durationNumber) || durationNumber <= 0)
        return { endDate: "N/A", cost: 0 };

      cost *= durationNumber;
      calculatedEndDate = calculatedEndDate.add(durationNumber, "year");
    }

    return {
      endDate: calculatedEndDate.format("YYYY-MM-DD"),
      cost: cost,
    };
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
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/SystemSettings/byType/KeepingType"
      );
      setSettings(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    }
  };

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
        customerEmail: reservation.customerEmail || "",
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

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedSetting(value);
    setContractData((prevState) => ({
      ...prevState,
      type: value,
    }));

    const setting = settings.find((s) => s.settingId === parseInt(value));
    if (setting) {
      let newDuration = duration;
      if (setting.settingName.includes("Gửi dưới 100 ngày")) {
        newDuration = "100";
      } else if (setting.settingName.includes("Gửi dưới 1 năm")) {
        newDuration = "365";
      }

      if (contractData.startDate) {
        const { endDate, cost } = calculateContractDetails(
          contractData.startDate,
          value,
          newDuration
        );
        setContractData((prevState) => ({
          ...prevState,
          endDate: endDate,
          totalAmount: cost,
          duration: newDuration,
        }));
        setNewEndDate(endDate);
        setCost(cost);
        setDuration(newDuration);
      }
    }
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDuration(value);
    setContractData((prevState) => ({
      ...prevState,
      duration: value,
    }));
    if (contractData.startDate && selectedSetting) {
      const { endDate, cost } = calculateContractDetails(
        contractData.startDate,
        selectedSetting,
        value
      );
      setContractData((prevState) => ({
        ...prevState,
        endDate: endDate,
        totalAmount: cost,
      }));
      setNewEndDate(endDate);
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
        toast.error(error.response.data + " Xin vui lòng thử lại");
      } else {
        toast.error(
          "Có lỗi xảy ra khi tạo hợp đồng. Xin vui lòng kiểm tra thông tin và thử lại."
        );
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
                label={
                  <span>
                    Tên khách hàng <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Số điện thoại khách hàng{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Email khách hàng <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Địa chỉ khách hàng <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Số CMND khách hàng <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Ngày cấp CMND <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Nơi cấp CMND <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Tên người quá cố <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Số CMND người quá cố <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                label={
                  <span>
                    Ngày sinh người quá cố
                    <span style={{ color: "red" }}> *</span>
                  </span>
                }
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
                label={
                  <span>
                    Ngày mất người quá cố
                    <span style={{ color: "red" }}> *</span>
                  </span>
                }
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
                label={
                  <span>
                    Số giấy chứng tử
                    <span style={{ color: "red" }}> *</span>
                  </span>
                }
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
                label={
                  <span>
                    Nơi cấp chứng tử
                    <span style={{ color: "red" }}> *</span>
                  </span>
                }
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
                <InputLabel>
                  <span>
                    Mối quan hệ với khách hàng
                    <span style={{ color: "red" }}> *</span>
                  </span>
                </InputLabel>
                <Select
                  name="relationshipWithCustomer"
                  value={contractData.relationshipWithCustomer}
                  onChange={handleChange}
                  label={
                    <span>
                      Mối quan hệ với khách hàng
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
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
                label={
                  <span>
                    Ngày bắt đầu hợp đồng
                    <span style={{ color: "red" }}> *</span>
                  </span>
                }
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
                <InputLabel>
                  {" "}
                  <span>
                    Loại hình gửi
                    <span style={{ color: "red" }}> *</span>
                  </span>
                </InputLabel>
                <Select
                  value={selectedSetting}
                  onChange={handleTypeChange}
                  label={
                    <span>
                      Loại hình gửi
                      <span style={{ color: "red" }}> *</span>
                    </span>
                  }
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.settingId}
                      value={setting.settingId.toString()}
                    >
                      {setting.settingName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <Typography color="error">{errors.type}</Typography>
                )}
              </FormControl>
            </Grid>
            {selectedSetting &&
              !settings
                .find((s) => s.settingId === parseInt(selectedSetting))
                ?.settingName.includes("Gửi dưới 100 ngày") &&
              !settings
                .find((s) => s.settingId === parseInt(selectedSetting))
                ?.settingName.includes("Gửi dưới 1 năm") && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Thời gian (năm)"
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    error={!!errors.duration}
                    helperText={errors.duration}
                  />
                </Grid>
              )}

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
