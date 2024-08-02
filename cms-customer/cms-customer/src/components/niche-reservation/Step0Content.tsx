import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dayjs from "dayjs";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface Setting {
  settingId: number;
  settingName: string;
  settingNumber: number;
  settingUnit?: string;
  settingType?: string;
}
const Step0Content = ({ selectedNiche, control, errors }: any) => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [selectedSetting, setSelectedSetting] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [totalCost, setTotalCost] = useState<number>(0);
  const [endDate, setEndDate] = useState<string | null>(null);
  useEffect(() => {
    axiosInstance
      .get("/api/SystemSettings/byType/KeepingType")
      .then((response) => {
        const data = response.data.$values;
        setSettings(data);
      })
      .catch((error) => {
        toast.error("Lỗi khi tải thông tin loại hình lưu trữ");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (!selectedSetting) {
      setTotalCost(0);
      setEndDate(null);
      return;
    }

    const setting = settings.find(
      (s) => s.settingId === parseInt(selectedSetting)
    );
    if (!setting) {
      toast.error("Không tìm thấy thông tin loại hình lưu trữ");
      setTotalCost(0);
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
        setTotalCost(0);
        setEndDate(null);
        return;
      }

      cost *= durationNumber; // Calculate total cost based on number of years
      calculatedEndDate = calculatedEndDate.add(durationNumber, "year");
    }

    setTotalCost(cost);
    setEndDate(calculatedEndDate.format("DD/MM/YYYY"));
  }, [selectedSetting, duration, startDate, settings]);

  const settingsCarousel = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Hide arrows
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          {selectedNiche.buildingName}
          {" -"} {selectedNiche.floorName}
          {" -"} {selectedNiche.areaName}
          {" - Ô "} {selectedNiche.nicheName}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className="carousel-container">
          <Slider {...settingsCarousel}>
            <div className="carousel-slide">
              <Image
                src={selectedNiche.buildingPicture || "/placeholder.png"}
                alt="Building"
                layout="responsive"
                width={700}
                height={475}
              />
            </div>
            <div className="carousel-slide">
              <Image
                src={selectedNiche.floorPicture || "/placeholder.png"}
                alt="Floor"
                layout="responsive"
                width={700}
                height={475}
              />
            </div>
            <div className="carousel-slide">
              <Image
                src={selectedNiche.areaPicture || "/placeholder.png"}
                alt="Area"
                layout="responsive"
                width={700}
                height={475}
              />
            </div>
          </Slider>
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" gutterBottom>
          Tòa nhà {selectedNiche.buildingName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {selectedNiche.buildingDescription}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {selectedNiche.floorName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {selectedNiche.floorDescription}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {selectedNiche.areaName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {selectedNiche.areaDescription}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Ô chứa {selectedNiche.nicheName}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {selectedNiche.nicheDescription}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
          Dự toán chi phí lưu trữ
        </Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Chọn ngày bắt đầu"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Nhập số năm"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Typography
          variant="body1"
          fontWeight={700}
          sx={{ mt: 2 }}
          align="center"
        >
          Tổng chi phí:{" "}
          {totalCost.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          sx={{ mt: 2 }}
          align="center"
        >
          Ngày kết thúc: {endDate}
        </Typography>
      </Grid>
      <style jsx>{`
        .carousel-container {
          position: relative;
        }
        .carousel-slide {
          padding: 10px;
        }
      `}</style>
    </Grid>
  );
};

export default Step0Content;
