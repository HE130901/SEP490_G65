import React, { useState } from "react";
import {
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
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
}: any) => {
  const [note, setNote] = useState("");
  const maxCharacters = 300;

  const handleNoteChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNote(event.target.value);
  };

  return (
    <>
      {!user && (
        <>
          <Typography variant="h6" gutterBottom>
            Thông tin cá nhân
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
                    helperText={
                      errors.name ? errors.name.message?.toString() : ""
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        color: "#0e0101",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#0e0101",
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
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
            </Grid>

            <Grid item xs={12} md={6}>
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
                      errors.phoneNumber
                        ? errors.phoneNumber.message?.toString()
                        : ""
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        color: "#0e0101",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#0e0101",
                      },
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
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
            </Grid>
          </Grid>
        </>
      )}
      <Typography variant="h6" gutterBottom pt={2}>
        Lịch hẹn ký hợp đồng
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="signAddress"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                row
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
        </Grid>

        <Grid item xs={12} md={6}>
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
                  errors.contractDate
                    ? errors.contractDate.message?.toString()
                    : ""
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
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#0e0101",
                    },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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
              "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#0e0101",
                },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  value={note}
                  onChange={(e) => {
                    handleNoteChange(e);
                    field.onChange(e);
                  }}
                  label={<span>Ghi chú (nếu có)</span>}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 300 }}
                  sx={{
                    "& .MuiInputBase-root": {
                      color: "#0e0101",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#0e0101",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#0e0101",
                      },
                    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#0e0101",
                      },
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="right"
                  sx={{ mt: 1 }}
                >
                  {note.length}/{maxCharacters} ký tự
                </Typography>
              </>
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Step1Content;
