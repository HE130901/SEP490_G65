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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReservationSelect from "./ReservationSelect";

const ContractAdd: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
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
  });

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
      }));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContractData((prevState) => ({
      ...prevState,
      [name]: name === "totalAmount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting contract data:", contractData);

    try {
      const response = await axiosInstance.post(
        "/api/ContractForStaff/create-contract",
        contractData
      );
      console.log("Submission response:", response);
      toast.success("Hợp đồng đã được tạo thành công!");
      onClose();
    } catch (error: any) {
      console.error("Error during submission:", error);
      if (error.response) {
        toast.error(
          "Đã xảy ra lỗi khi tạo hợp đồng. Vui lòng kiểm tra dữ liệu và thử lại."
        );
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Thêm Hợp Đồng</DialogTitle>
        <DialogContent>
          <ReservationSelect
            reservations={reservations}
            selectedReservationCode={selectedReservationCode}
            onSelect={handleReservationSelect}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Thông tin hợp đồng</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Tên khách hàng"
                  name="customerFullName"
                  value={contractData.customerFullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại khách hàng"
                  name="customerPhoneNumber"
                  value={contractData.customerPhoneNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email khách hàng"
                  name="customerEmail"
                  value={contractData.customerEmail}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ khách hàng"
                  name="customerAddress"
                  value={contractData.customerAddress}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số CMND khách hàng"
                  name="customerCitizenId"
                  value={contractData.customerCitizenId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ngày cấp CMND"
                  type="date"
                  name="customerCitizenIdIssueDate"
                  value={contractData.customerCitizenIdIssueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nơi cấp CMND"
                  name="customerCitizenIdSupplier"
                  value={contractData.customerCitizenIdSupplier}
                  onChange={handleChange}
                />
              </Grid>
              {/* Deceased Information */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên người quá cố"
                  name="deceasedFullName"
                  value={contractData.deceasedFullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số CMND người quá cố"
                  name="deceasedCitizenId"
                  value={contractData.deceasedCitizenId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ngày sinh người quá cố"
                  type="date"
                  name="deceasedDateOfBirth"
                  value={contractData.deceasedDateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ngày mất người quá cố"
                  type="date"
                  name="deceasedDateOfDeath"
                  value={contractData.deceasedDateOfDeath}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số chứng tử"
                  name="deathCertificateNumber"
                  value={contractData.deathCertificateNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nơi cấp chứng tử"
                  name="deathCertificateSupplier"
                  value={contractData.deathCertificateSupplier}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mối quan hệ với khách hàng"
                  name="relationshipWithCustomer"
                  value={contractData.relationshipWithCustomer}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  name="startDate"
                  value={contractData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  name="endDate"
                  value={contractData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  name="note"
                  value={contractData.note}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tổng số tiền"
                  name="totalAmount"
                  type="number"
                  value={contractData.totalAmount}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default ContractAdd;
