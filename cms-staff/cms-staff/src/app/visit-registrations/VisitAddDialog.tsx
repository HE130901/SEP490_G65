"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { z } from "zod";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { set } from "react-hook-form";

interface VisitAddDialogProps {
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  customerId: z.number().min(1, "Vui lòng chọn hợp đồng"),
  nicheId: z.number().min(1, "Vui lòng chọn hợp đồng"),
  visitDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const now = new Date();
    return selectedDate >= now;
  }, "Ngày viếng thăm phải là ngày hiện tại trở đi"),
  accompanyingPeople: z
    .number()
    .min(0, "Số lượng người đi cùng không hợp lệ")
    .max(20, "Số lượng người đi cùng tối đa là 20"),
  note: z.string().max(300, "Ghi chú không được vượt quá 300 ký tự").optional(),
});

const VisitAddDialog: React.FC<VisitAddDialogProps> = ({ open, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: 0,
    nicheId: 0,
    visitDate: new Date().toISOString().slice(0, 16), // Default to current date and time
    accompanyingPeople: 0,
    note: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const fetchContracts = async () => {
        try {
          const response = await ServiceOrderAPI.getAllContracts();
          const allContractsData = response.data.$values || response.data;
          // Lọc ra các hợp đồng có trạng thái không phải "Expired" hoặc "Canceled"
          const validContracts = allContractsData.filter(
            (contract: { status: string }) =>
              contract.status !== "Expired" && contract.status !== "Canceled"
          );

          setContracts(validContracts);

          if (validContracts.length > 0) {
            const firstContract = validContracts[0];
            setFormData((prevData) => ({
              ...prevData,
              customerId: firstContract.customerId,
              nicheId: firstContract.nicheId,
            }));
          }
        } catch (error) {
          toast.error("Không thể tải danh sách hợp đồng");
        }
      };

      fetchContracts();
    }
  }, [open]);
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<number>
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "accompanyingPeople" ? +value : value,
    }));
    validateField(name as keyof typeof formSchema.shape, value);
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm đăng ký viếng thăm</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth margin="normal" error={!!formErrors.customerId}>
          <InputLabel id="contract-label">
            {" "}
            <span>
              Hợp đồng <span style={{ color: "red" }}>*</span>
            </span>
          </InputLabel>
          <Select
            labelId="contract-label"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            label={
              <span>
                Hợp đồng <span style={{ color: "red" }}>*</span>
              </span>
            }
          >
            {contracts.map((contract) => (
              <MenuItem key={contract.contractId} value={contract.contractId}>
                {`${contract.contractCode} (${contract.customerName} | ${contract.nicheAddress})`}
              </MenuItem>
            ))}
          </Select>
          {formErrors.customerId && (
            <FormHelperText>{formErrors.customerId}</FormHelperText>
          )}
        </FormControl>
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
