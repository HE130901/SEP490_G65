import * as React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { ServiceOrder } from "./ServiceOrderList";

interface EditDateDialogProps {
  record: ServiceOrder | null;
  onClose: () => void;
  onSave: (record: ServiceOrder) => void;
}

const EditDateDialog: React.FC<EditDateDialogProps> = ({
  record,
  onClose,
  onSave,
}) => {
  const [orderDate, setOrderDate] = React.useState<string>(
    record ? record.orderDate : ""
  );

  React.useEffect(() => {
    if (record) {
      setOrderDate(record.orderDate);
    }
  }, [record]);

  const handleSave = () => {
    if (record) {
      onSave({ ...record, orderDate });
    }
  };

  if (!record) return null;

  return (
    <Dialog open={!!record} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa ngày hẹn</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <strong>Mã đơn hàng:</strong> {record.serviceOrderId}
        </DialogContentText>
        <TextField
          label="Ngày hẹn"
          type="datetime-local"
          fullWidth
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy bỏ
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDateDialog;
