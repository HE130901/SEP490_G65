"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface SystemSetting {
  settingId: number;
  settingName: string;
  settingNumber: number;
  settingUnit: string;
}

const SettingPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [newSettingNumber, setNewSettingNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axiosInstance
      .get("/api/SystemSettings")
      .then((response) => {
        const data = response.data.$values;
        if (Array.isArray(data)) {
          setSettings(data);
        } else {
          console.error("Dữ liệu không đúng định dạng", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id: number) => {
    setEditId(id);
    const setting = settings.find((s) => s.settingId === id);
    if (setting) {
      setNewSettingNumber(setting.settingNumber.toString());
    }
  };

  const handleSave = (id: number) => {
    const updatedSettingNumber = parseFloat(newSettingNumber);
    if (isNaN(updatedSettingNumber)) {
      toast.error("Giá trị không hợp lệ");
      return;
    }

    axiosInstance
      .patch(`/api/SystemSettings/${id}`, {
        settingNumber: updatedSettingNumber,
      })
      .then(() => {
        setSettings(
          settings.map((s) =>
            s.settingId === id
              ? { ...s, settingNumber: updatedSettingNumber }
              : s
          )
        );
        setEditId(null);
        setNewSettingNumber("");
        toast.success("Cập nhật thành công");
      })
      .catch((error) => {
        toast.error("Cập nhật thất bại");
        console.error(
          error.response ? error.response.data : "Lỗi không xác định"
        );
      });
  };

  const handleCancel = () => {
    setEditId(null);
    setNewSettingNumber("");
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Thiết lập giá
      </Typography>
      <Grid container spacing={2}>
        {loading ? (
          <Typography variant="h6">Đang tải...</Typography>
        ) : (
          settings.map((setting) => (
            <Grid item xs={12} sm={6} md={4} key={setting.settingId}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">
                    {setting.settingName} ({setting.settingUnit})
                  </Typography>
                  {editId === setting.settingId ? (
                    <>
                      <TextField
                        fullWidth
                        value={newSettingNumber}
                        onChange={(e) => setNewSettingNumber(e.target.value)}
                        type="number"
                        label="Giá trị"
                        variant="outlined"
                        sx={{ mt: 2 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSave(setting.settingId)}
                          startIcon={<SaveIcon />}
                          sx={{ mr: 1 }}
                        >
                          Lưu
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancel}
                          startIcon={<CancelIcon />}
                        >
                          Hủy
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Typography variant="body2">
                        Giá trị:{" "}
                        {setting.settingNumber.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                      <Button
                        variant="text"
                        onClick={() => handleEdit(setting.settingId)}
                        startIcon={<EditIcon />}
                      >
                        Sửa
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default SettingPage;
