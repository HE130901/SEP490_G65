"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import styled from "@emotion/styled";
import Image from "next/image";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTypography = styled(Typography)`
  margin-top: 1rem;
`;

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onImageUpload,
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

  const handleUpload = async () => {
    if (!image) {
      toast.error("Vui lòng chọn một hình ảnh để tải lên");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const uploadResponse = await axiosInstance.post(
        "/api/Image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!uploadResponse.data) {
        throw new Error("Failed to upload image");
      }

      const imageUrl = uploadResponse.data.imageUrl || uploadResponse.data;
      toast.success("Hình ảnh đã được tải lên");
      onImageUpload(imageUrl);
      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải lên hình ảnh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Chọn hình ảnh</DialogTitle>
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
          onClick={handleUpload}
          color="primary"
          variant="contained"
          disabled={!image || loading}
        >
          {loading ? <CircularProgress size={24} /> : "Tải lên"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadDialog;
