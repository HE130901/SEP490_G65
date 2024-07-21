"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setImageUrl(""); // Reset imageUrl when a new file is selected
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image to upload");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "https://localhost:7148/Image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setImageUrl(response.data);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Typography variant="h5" gutterBottom>
            Upload Image
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button
              variant="contained"
              component="label"
              style={{ marginBottom: "1rem" }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {image && (
              <Typography variant="body1" gutterBottom>
                Selected file: {image.name}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!image || loading}
              style={{ marginTop: "1rem" }}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
            {imageUrl && (
              <Box mt={2} width="100%">
                <Typography variant="body1" gutterBottom>
                  Uploaded Image URL:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={imageUrl}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Box mt={2}>
                  <Image
                    src={imageUrl}
                    alt="Uploaded"
                    width={400}
                    height={300}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ImageUpload;
