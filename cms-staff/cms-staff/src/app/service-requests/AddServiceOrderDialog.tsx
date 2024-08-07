"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { toast } from "react-toastify";

const AddServiceOrderDialog = ({
  open,
  onClose,
  onAddSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    contractId: "",
    orderDate: "",
    serviceOrderDetails: [{ serviceID: "", quantity: 1 }],
  });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await ServiceOrderAPI.getAllContracts();
        const fetchedContracts = response.data.$values || response.data;

        // Filter out contracts with "Expired" or "Canceled" statuses
        const activeContracts = fetchedContracts.filter(
          (contract: any) =>
            contract.status !== "Expired" && contract.status !== "Canceled"
        );

        setContracts(activeContracts);
      } catch (error) {
        toast.error("Không thể tải danh sách hợp đồng");
      }
    };

    const fetchServices = async () => {
      try {
        const response = await ServiceOrderAPI.getAllServices();
        setServices(response.data.$values || response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách dịch vụ");
      }
    };

    fetchContracts();
    fetchServices();
  }, []);

  const handleAddService = () => {
    setFormData((prevData) => ({
      ...prevData,
      serviceOrderDetails: [
        ...prevData.serviceOrderDetails,
        { serviceID: "", quantity: 1 },
      ],
    }));
  };

  const handleRemoveService = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      serviceOrderDetails: prevData.serviceOrderDetails.filter(
        (item, i) => i !== index
      ),
    }));
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleServiceDetailChange = (
    index: number,
    event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    const updatedServiceDetails = formData.serviceOrderDetails.map(
      (detail, i) => (i === index ? { ...detail, [name]: value } : detail)
    );
    setFormData((prevData) => ({
      ...prevData,
      serviceOrderDetails: updatedServiceDetails,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const selectedContract = contracts.find(
        (contract) => contract.contractId === formData.contractId
      );

      const requestData = {
        customerID: selectedContract.customerId,
        nicheID: selectedContract.nicheId,
        orderDate: formData.orderDate,
        serviceOrderDetails: formData.serviceOrderDetails,
      };

      await ServiceOrderAPI.createServiceOrder(requestData);
      toast.success("Đơn đăng ký dùng dịch vụ đã được tạo thành công");
      onAddSuccess();
      onClose();
    } catch (error) {
      toast.error("Không thể tạo đơn đăng ký dùng dịch vụ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm mới đơn đăng ký dùng dịch vụ</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="contract-label">
              {" "}
              <span>
                Hợp đồng <span style={{ color: "red" }}>*</span>
              </span>
            </InputLabel>
            <Select
              labelId="contract-label"
              name="contractId"
              value={formData.contractId}
              onChange={(e: SelectChangeEvent<string>) =>
                setFormData({ ...formData, contractId: e.target.value })
              }
              label={
                <span>
                  Hợp đồng <span style={{ color: "red" }}>*</span>
                </span>
              }
            >
              {contracts.map((contract) => (
                <MenuItem key={contract.contractId} value={contract.contractId}>
                  {`Mã HĐ: ${contract.contractId} (${contract.customerName} - ${contract.nicheAddress})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label={
            <span>
              Ngày hẹn <span style={{ color: "red" }}>*</span>
            </span>
          }
          name="orderDate"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.orderDate}
          onChange={handleChange}
        />
        {formData.serviceOrderDetails.map((detail, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <FormControl fullWidth margin="normal" style={{ marginRight: 8 }}>
              <InputLabel id={`service-label-${index}`}>
                {" "}
                <span>
                  Dịch vụ <span style={{ color: "red" }}>*</span>
                </span>
              </InputLabel>
              <Select
                labelId={`service-label-${index}`}
                name="serviceID"
                value={detail.serviceID}
                onChange={(event: SelectChangeEvent<string>) =>
                  handleServiceDetailChange(index, event)
                }
                label={
                  <span>
                    Dịch vụ <span style={{ color: "red" }}>*</span>
                  </span>
                }
              >
                {services.map((service) => (
                  <MenuItem key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label={
                <span>
                  Số lượng <span style={{ color: "red" }}>*</span>
                </span>
              }
              name="quantity"
              type="number"
              value={detail.quantity}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleServiceDetailChange(index, event)
              }
            />
            <IconButton onClick={() => handleRemoveService(index)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddService}
        >
          Thêm dịch vụ
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Thêm mới{" "}
          {isSubmitting && (
            <CircularProgress size={24} sx={{ marginLeft: 2 }} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceOrderDialog;
