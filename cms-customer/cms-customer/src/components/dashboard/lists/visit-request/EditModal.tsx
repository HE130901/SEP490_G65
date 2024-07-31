"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  FormHelperText,
} from "@mui/material";
import { VisitRegistration } from "./VisitRegistrationList";
import { z } from "zod";
import { addMonths, format } from "date-fns";
import { format as formatTz } from "date-fns-tz";

type EditModalProps = {
  record: VisitRegistration;
  onSave: (updatedRecord: VisitRegistration) => void;
  onClose: () => void;
};

const today = new Date();
const maxDate = addMonths(today, 3);
const timezone = "Asia/Bangkok"; // Set your timezone here

const visitSchema = z.object({
  visitDate: z.string().refine(
    (dateString) => {
      const date = new Date(dateString);
      return date >= today && date <= maxDate;
    },
    {
      message:
        "Thời gian hẹn phải trong vòng 3 tháng kể từ thời điểm hiện tại.",
    }
  ),
  accompanyingPeople: z
    .number()
    .min(0, "Số người đi cùng phải lớn hơn hoặc bằng 0."),
  note: z.string().optional(),
});

const EditModal = ({ record, onSave, onClose }: EditModalProps) => {
  const [updatedRecord, setUpdatedRecord] = useState(record);
  const [formErrors, setFormErrors] = useState<{
    visitDate?: string;
    accompanyingPeople?: string;
  }>({});

  const handleChange = (field: keyof VisitRegistration, value: any) => {
    setUpdatedRecord({ ...updatedRecord, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      visitDate: updatedRecord.visitDate,
      accompanyingPeople: updatedRecord.accompanyingPeople,
      note: updatedRecord.note,
    };

    try {
      const parsedData = visitSchema.parse({
        visitDate: data.visitDate,
        accompanyingPeople: data.accompanyingPeople,
      });
      console.log("Data to be sent to backend:", parsedData); // Log data before sending to backend
      onSave(updatedRecord);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: {
          visitDate?: string;
          accompanyingPeople?: string;
        } = {};
        err.errors.forEach((error) => {
          if (error.path.includes("visitDate")) {
            fieldErrors.visitDate = error.message;
          } else if (error.path.includes("accompanyingPeople")) {
            fieldErrors.accompanyingPeople = error.message;
          }
        });
        setFormErrors(fieldErrors);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa Đơn đăng ký viếng</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Ngày Hẹn"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formatTz(
              new Date(updatedRecord.visitDate),
              "yyyy-MM-dd'T'HH:mm",
              { timeZone: timezone }
            )}
            onChange={(e) => handleChange("visitDate", e.target.value)}
            error={!!formErrors.visitDate}
            helperText={formErrors.visitDate}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: formatTz(today, "yyyy-MM-dd'T'HH:mm", {
                timeZone: timezone,
              }),
              max: formatTz(maxDate, "yyyy-MM-dd'T'HH:mm", {
                timeZone: timezone,
              }),
            }}
          />
          <TextField
            label="Số Người Đi Cùng"
            type="number"
            fullWidth
            margin="normal"
            value={updatedRecord.accompanyingPeople}
            onChange={(e) =>
              handleChange("accompanyingPeople", parseInt(e.target.value))
            }
            error={!!formErrors.accompanyingPeople}
            helperText={formErrors.accompanyingPeople}
          />
          <TextField
            label="Ghi Chú"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            value={updatedRecord.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
          {formErrors && (
            <FormHelperText error>
              {Object.values(formErrors).join(", ")}
            </FormHelperText>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
