"use client";

import ServiceOrderAPI from "@/services/serviceOrderService";
import axiosInstance from "@/utils/axiosInstance";
import styled from "@emotion/styled";
import { PhotoCamera } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin-bottom: 1rem;
  background-color: #007bff;
  color: #fff;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledTypography = styled(Typography)`
  margin-top: 1rem;
`;

const UpdateCompletionImageDialog = ({
  open,
  onClose,
  serviceOrderDetailId,
  onUpdateSuccess,
}: {
  open: boolean;
  onClose: () => void;
  serviceOrderDetailId: number | null;
  onUpdateSuccess: () => void;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);

      // Free memory when component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (serviceOrderDetailId === null || !image) {
      toast.error("Vui lòng chọn một hình ảnh để tải lên");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    console.log("FormData:", formData);

    try {
      console.log("Uploading image...");
      const uploadResponse = await axiosInstance.post(
        "/api/Image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload response:", uploadResponse);

      if (!uploadResponse.data) {
        throw new Error("Failed to upload image");
      }

      // Extract the image URL directly from the response data
      const imageUrl = uploadResponse.data.imageUrl || uploadResponse.data; // Ensure this matches the structure of your API response
      console.log("Image URL:", imageUrl);

      const data = {
        serviceOrderDetailID: serviceOrderDetailId,
        completionImage: imageUrl,
      };

      console.log("Data being sent to update service order:", data);

      console.log("Updating service order...");
      await ServiceOrderAPI.updateCompletionImage(data);
      console.log("Service order updated successfully");

      toast.success("Hình ảnh hoàn thành đã được cập nhật");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating completion image:", error);
      toast.error("Không thể cập nhật hình ảnh hoàn thành");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cập nhật hình ảnh hoàn thành</DialogTitle>
      <StyledDialogContent>
        <Button
          variant="contained"
          startIcon={<PhotoCamera />}
          component="label"
        >
          Chọn File
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {image && (
          <StyledTypography variant="body1">
            File đã chọn: {image.name}
          </StyledTypography>
        )}
        {preview && (
          <Box mt={2} mb={2}>
            <Image
              width={300}
              height={300}
              src={preview}
              alt="Preview"
              style={{ borderRadius: "10px" }}
            />
          </Box>
        )}
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!image || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCompletionImageDialog;
