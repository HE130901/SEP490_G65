"use client";

import React, { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  Button,
  Grid,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { formatVND } from "@/utils/formatCurrency";
import { z } from "zod";

// Zod schema for form validation
const schema = z.object({
  type: z.enum(["Gửi theo tháng", "Gửi theo năm"]),
  duration: z.union([
    z
      .number()
      .min(1)
      .max(12)
      .int()
      .refine((val) => val <= 12, {
        message: "Thời gian tối đa là 12 tháng",
      }),
    z
      .number()
      .min(1)
      .max(10)
      .int()
      .refine((val) => val <= 10, {
        message: "Thời gian tối đa là 10 năm",
      }),
  ]),
});

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

const calculateEndDate = (
  startDate: string,
  type: string,
  duration: number
): string => {
  if (!startDate) return "";
  const date = new Date(startDate);
  if (type === "Gửi theo tháng") {
    date.setMonth(date.getMonth() + duration);
  } else if (type === "Gửi theo năm") {
    date.setFullYear(date.getFullYear() + duration);
  }
  return date.toLocaleDateString("vi-VN");
};

interface NicheDetailDialogProps {
  isVisible: boolean;
  onClose: () => void;
  niche: any;
  onProceedToBooking: (niche: any, type: string, duration: number) => void;
}

const NicheDetailDialog: FC<NicheDetailDialogProps> = ({
  isVisible,
  onClose,
  niche,
  onProceedToBooking,
}) => {
  const [type, setType] = useState<string>("Gửi theo tháng");
  const [duration, setDuration] = useState<number>(1);
  const [startDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);

  if (!niche) return null;

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(Number(event.target.value));
  };

  const handleSubmit = () => {
    try {
      schema.parse({ type, duration });
      setError(null);
      onProceedToBooking(niche, type, duration); // Pass niche to onProceedToBooking
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      }
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết ô chứa</DialogTitle>
      <DialogContent className="bg-gradient-to-b from-white to-stone-300">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Carousel autoPlay infiniteLoop>
              <div>
                <Image
                  src={niche.buildingPicture || "/placeholder.png"}
                  alt="Building"
                  layout="responsive"
                  width={700}
                  height={475}
                />
              </div>
              <div>
                <Image
                  src={niche.floorPicture || "/placeholder.png"}
                  alt="Floor"
                  layout="responsive"
                  width={700}
                  height={475}
                />
              </div>
              <div>
                <Image
                  src={niche.areaPicture || "/placeholder.png"}
                  alt="Area"
                  layout="responsive"
                  width={700}
                  height={475}
                />
              </div>
            </Carousel>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              {niche.buildingName}
              {" -"} {niche.floorName}
              {" -"} {niche.areaName}
              {" - Ô "} {niche.nicheName}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Loại hình gửi"
                  value={type}
                  onChange={handleTypeChange}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="Gửi theo tháng">Gửi theo tháng</MenuItem>
                  <MenuItem value="Gửi theo năm">Gửi theo năm</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Thời gian"
                  value={duration}
                  onChange={handleDurationChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: type === "Gửi theo tháng" ? 12 : 10,
                    },
                  }}
                  error={!!error}
                  helperText={error}
                />
              </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom>
              Giá dự tính: {formatVND(calculateCost(type, duration))}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Thời gian: {calculateEndDate(startDate, type, duration)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Tòa nhà {niche.buildingName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {niche.buildingDescription}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {niche.floorName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {niche.floorDescription}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {niche.areaName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {niche.areaDescription}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Ô chứa {niche.nicheName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {niche.nicheDescription}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "#0e0101",
            color: "#0e0101",
            "&:hover": { borderColor: "#0e0101", color: "#0e0101" },
          }}
        >
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#FB8C00",
            "&:hover": { backgroundColor: "#EF6C00" },
          }}
        >
          Tiếp tục đặt chỗ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NicheDetailDialog;
