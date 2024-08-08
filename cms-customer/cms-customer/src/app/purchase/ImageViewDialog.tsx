import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import Image from "next/image";

interface ImageViewDialogProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
}

const ImageViewDialog: React.FC<ImageViewDialogProps> = ({
  open,
  imageSrc,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Chi tiết hình ảnh</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src={imageSrc} alt="Detailed View" width={500} height={500} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageViewDialog;
