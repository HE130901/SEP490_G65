"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Define the Setting interface
interface Setting {
  settingId: number;
  settingName: string;
  settingNumber: number;
  settingUnit?: string;
  settingType?: string;
}

function CalculateCost() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/SystemSettings/byType/KeepingType")
      .then((response) => {
        const data = response.data.$values as Setting[];
        setSettings(data);
      })
      .catch((error) => {
        toast.error("Failed to fetch settings");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (!selectedSetting) {
      setTotalCost(null);
      setEndDate(null);
      return;
    }

    const setting = settings.find(
      (s) => s.settingId === parseInt(selectedSetting)
    );
    if (!setting) {
      toast.error("Invalid setting selected");
      setTotalCost(null);
      setEndDate(null);
      return;
    }

    let cost = setting.settingNumber;
    let calculatedEndDate = dayjs(startDate);

    if (setting.settingName.includes("Gửi dưới 100 ngày")) {
      calculatedEndDate = calculatedEndDate.add(100, "days");
    } else if (setting.settingName.includes("Gửi dưới 1 năm")) {
      calculatedEndDate = calculatedEndDate.add(1, "year");
    } else {
      const durationNumber = parseInt(duration);
      if (isNaN(durationNumber) || durationNumber <= 0) {
        toast.error("Invalid duration entered");
        setTotalCost(null);
        setEndDate(null);
        return;
      }

      cost *= durationNumber; // Calculate total cost based on number of years
      calculatedEndDate = calculatedEndDate.add(durationNumber, "year");
    }

    setTotalCost(cost);
    setEndDate(calculatedEndDate.format("DD/MM/YYYY"));
  }, [selectedSetting, duration, startDate, settings]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Chọn loại hình</InputLabel>
        <Select
          value={selectedSetting}
          onChange={(e) => setSelectedSetting(e.target.value)}
          label="Chọn loại hình"
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
      </FormControl>

      <TextField
        fullWidth
        label="Chọn ngày bắt đầu"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        sx={{ mb: 2 }}
      />

      {selectedSetting &&
        !settings
          .find((s) => s.settingId === parseInt(selectedSetting))
          ?.settingName.includes("Gửi dưới 100 ngày") &&
        !settings
          .find((s) => s.settingId === parseInt(selectedSetting))
          ?.settingName.includes("Gửi dưới 1 năm") && (
          <TextField
            fullWidth
            label="Nhập số năm"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

      {totalCost !== null && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Tổng chi phí:{" "}
          {totalCost.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>
      )}

      {endDate && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Ngày kết thúc: {endDate}
        </Typography>
      )}
    </Box>
  );
}

export default CalculateCost;
