import React from "react";
import { Grid, Typography, Divider, TextField, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Step0Content = ({
  selectedNiche,
  selectedBuilding,
  selectedFloor,
  selectedArea,
  calculateCost,
  type,
  duration,
  formatVND,
  control,
  getAllowedDates,
  errors,
}: any) => {
  const settings = {
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
      <Grid item xs={12} sm={6}>
        <div className="carousel-container">
          <Slider {...settings}>
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
        <Typography variant="h6" gutterBottom>
          {selectedNiche.buildingName}
          {" -"} {selectedNiche.floorName}
          {" -"} {selectedNiche.areaName}
          {" - Ô "} {selectedNiche.nicheName}
        </Typography>
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
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="type"
              control={control}
              defaultValue="Gửi theo tháng"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Loại hình gửi"
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="Gửi theo tháng">Gửi theo tháng</MenuItem>
                  <MenuItem value="Gửi theo năm">Gửi theo năm</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="duration"
              control={control}
              defaultValue={1}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Thời gian"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: type === "Gửi theo tháng" ? 12 : 10,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom>
          Giá dự tính: {formatVND(calculateCost(type, duration))}
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
