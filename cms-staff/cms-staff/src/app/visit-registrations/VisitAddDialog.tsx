"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { z } from "zod";
import ServiceOrderAPI from "@/services/serviceOrderService";

interface VisitAddDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Contract {
  contractId: number;
  contractCode: string;
  customerName: string;
  nicheCode: string;
  customerId: number;
  nicheId: number;
  status: string;
}

const formSchema = z.object({
  customerId: z.number().min(1, "Vui lòng chọn hợp đồng"),
  nicheId: z.number().min(1, "Vui lòng chọn hợp đồng"),
  visitDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 30);
    return selectedDate >= now && selectedDate <= maxDate;
  }, "Ngày viếng thăm phải trong vòng 30 ngày từ hôm nay"),
  accompanyingPeople: z
    .number()
    .min(0, "Số lượng người đi cùng không hợp lệ")
    .max(20, "Số lượng người đi cùng tối đa là 20"),
  note: z.string().max(300, "Ghi chú không được vượt quá 300 ký tự").optional(),
});

const VisitAddDialog: React.FC<VisitAddDialogProps> = ({ open, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [formData, setFormData] = useState({
    customerId: 0,
    nicheId: 0,
    visitDate: new Date().toISOString().slice(0, 16),
    accompanyingPeople: 0,
    note: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  useEffect(() => {
    if (open) {
      const fetchContracts = async () => {
        try {
          const response = await ServiceOrderAPI.getAllContracts();
          const allContractsData = response.data.$values || response.data;
          const validContracts = allContractsData.filter(
            (contract: Contract) =>
              contract.status !== "Expired" && contract.status !== "Canceled"
          );

          setContracts(validContracts);
        } catch (error) {
          toast.error("Không thể tải danh sách hợp đồng");
        }
      };

      fetchContracts();
    }
  }, [open]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "accompanyingPeople" ? +value : value,
    }));
    validateField(name as keyof typeof formSchema.shape, value);
  };

  const handleContractChange = (event: any, newValue: Contract | null) => {
    setSelectedContract(newValue);
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        customerId: newValue.customerId,
        nicheId: newValue.nicheId,
      }));
      validateField("customerId", newValue.customerId);
      validateField("nicheId", newValue.nicheId);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        customerId: 0,
        nicheId: 0,
      }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        customerId: "Vui lòng chọn hợp đồng",
      }));
    }
  };

  const validateField = (
    name: keyof typeof formSchema.shape,
    value: string | number
  ) => {
    try {
      formSchema.shape[name].parse(
        name === "accompanyingPeople" ? Number(value) : value
      );
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error.errors[0].message,
        }));
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      formSchema.parse({
        ...formData,
        accompanyingPeople: Number(formData.accompanyingPeople),
      });
      await axiosInstance.post("/api/VisitRegistrations", formData);
      toast.success("Đăng ký viếng thăm đã được thêm thành công");
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          errors[err.path[0] as string] = err.message;
        });
        setFormErrors(errors);
      } else {
        toast.error("Không thể thêm đăng ký viếng thăm");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 16);
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 30))
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm đăng ký viếng thăm</DialogTitle>
      <DialogContent dividers>
        <Autocomplete
          options={contracts}
          getOptionLabel={(option) =>
            `${option.contractCode} (${option.customerName} | ${option.nicheCode})`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <span>
                  Hợp đồng <span style={{ color: "red" }}>*</span>
                </span>
              }
              margin="normal"
              error={!!formErrors.customerId}
              helperText={formErrors.customerId}
            />
          )}
          value={selectedContract}
          onChange={handleContractChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label={
            <span>
              Ngày viếng thăm <span style={{ color: "red" }}>*</span>
            </span>
          }
          type="datetime-local"
          fullWidth
          variant="outlined"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          error={!!formErrors.visitDate}
          helperText={formErrors.visitDate}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: today,
            max: maxDate,
          }}
        />
        <TextField
          margin="dense"
          label={
            <span>
              Số lượng người đi cùng <span style={{ color: "red" }}>*</span>
            </span>
          }
          type="number"
          fullWidth
          variant="outlined"
          name="accompanyingPeople"
          value={formData.accompanyingPeople}
          onChange={handleChange}
          error={!!formErrors.accompanyingPeople}
          helperText={formErrors.accompanyingPeople}
        />
        <TextField
          margin="dense"
          label="Ghi chú (nếu có)"
          type="text"
          fullWidth
          variant="outlined"
          name="note"
          value={formData.note}
          onChange={handleChange}
          error={!!formErrors.note}
          helperText={`${formData.note.length}/300 ${formErrors.note || ""}`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
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

export default VisitAddDialog;
