import React from "react";
import {
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Controller } from "react-hook-form";

const predefinedAddresses = [
  "Nhà tang lễ thành phố",
  "Nghĩa trang Văn Điển",
  "An Bình Viên - Hòa Lạc",
];

const Step1Content = ({
  control,
  errors,
  selectedBuilding,
  selectedFloor,
  selectedArea,
  selectedNiche,
  getAllowedDates,
  user,
}: any) => (
  <>
    {!user && (
      <>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <span>
                  Tên của bạn <span style={{ color: "red" }}>*</span>
                </span>
              }
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message?.toString() : ""}
              sx={{
                "& .MuiInputBase-root": {
                  color: "#0e0101",
                },
                "& .MuiInputLabel-root": {
                  color: "#0e0101",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0e0101",
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#0e0101",
                  },
              }}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={
                <span>
                  Số điện thoại <span style={{ color: "red" }}>*</span>
                </span>
              }
              fullWidth
              margin="normal"
              error={!!errors.phoneNumber}
              helperText={
                errors.phoneNumber ? errors.phoneNumber.message?.toString() : ""
              }
              sx={{
                "& .MuiInputBase-root": {
                  color: "#0e0101",
                },
                "& .MuiInputLabel-root": {
                  color: "#0e0101",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0e0101",
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#0e0101",
                  },
              }}
            />
          )}
        />
      </>
    )}
    <Controller
      name="signAddress"
      control={control}
      render={({ field }) => (
        <RadioGroup
          {...field}
          value={field.value || predefinedAddresses[0]}
          onChange={(e) => field.onChange(e.target.value)}
          sx={{
            "& .MuiFormControlLabel-root .MuiTypography-root": {
              color: "#0e0101",
            },
            "& .MuiRadio-root.Mui-checked": {
              color: "#0e0101",
            },
          }}
        >
          {predefinedAddresses.map((address) => (
            <FormControlLabel
              key={address}
              value={address}
              control={<Radio />}
              label={address}
            />
          ))}
        </RadioGroup>
      )}
    />
    <Controller
      name="contractDate"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={
            <span>
              Ngày hẹn ký hợp đồng <span style={{ color: "red" }}>*</span>
            </span>
          }
          type="date"
          fullWidth
          margin="normal"
          error={!!errors.contractDate}
          helperText={
            errors.contractDate ? errors.contractDate.message?.toString() : ""
          }
          inputProps={{
            min: getAllowedDates()[0],
            max: getAllowedDates()[2],
          }}
          sx={{
            "& .MuiInputBase-root": {
              color: "#0e0101",
            },
            "& .MuiInputLabel-root": {
              color: "#0e0101",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0e0101",
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0e0101",
            },
          }}
        />
      )}
    />
    <TextField
      label="Ô đã chọn"
      value={`${selectedBuilding?.buildingName} - ${selectedFloor?.floorName} - ${selectedArea?.areaName} - Ô số ${selectedNiche?.nicheName}`}
      fullWidth
      margin="normal"
      InputProps={{
        readOnly: true,
      }}
      sx={{
        "& .MuiInputBase-root": {
          color: "#0e0101",
        },
        "& .MuiInputLabel-root": {
          color: "#0e0101",
        },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          borderColor: "#0e0101",
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          borderColor: "#0e0101",
        },
      }}
    />
    <Controller
      name="note"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Ghi chú"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          sx={{
            "& .MuiInputBase-root": {
              color: "#0e0101",
            },
            "& .MuiInputLabel-root": {
              color: "#0e0101",
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0e0101",
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0e0101",
            },
          }}
        />
      )}
    />
  </>
);

export default Step1Content;
