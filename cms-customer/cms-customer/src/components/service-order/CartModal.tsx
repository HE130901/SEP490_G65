"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import { useCart } from "@/context/CartContext";
import { useStateContext } from "@/context/StateContext"; // Import useStateContext
import Image from "next/image";
import PaymentService from "@/services/paymentService";
import { toast } from "react-toastify";
import NicheAPI from "@/services/nicheService";
import ItemType from "./ItemType";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Link from "next/link";

interface CartModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface Niche {
  nicheId: number;
  nicheAddress: string;
}

const CartModal = ({ isOpen, setIsOpen }: CartModalProps) => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { user } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [nicheID, setNicheID] = useState<number>(1);
  const [orderDate, setOrderDate] = useState<string>("");
  const [niches, setNiches] = useState<Niche[]>([]);
  const [isNichesLoading, setNichesLoading] = useState<boolean>(true);
  const [dateError, setDateError] = useState<string>("");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(open);
    }
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleDecreaseQuantity = (item: ItemType) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleIncreaseQuantity = (item: ItemType) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const validateOrderDate = (date: string): boolean => {
    const selectedDate = new Date(date);
    const today = new Date();
    const oneMonthLater = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );

    return selectedDate >= today && selectedDate <= oneMonthLater;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setOrderDate(newDate);

    if (!validateOrderDate(newDate)) {
      setDateError("Ngày hẹn phải trong vòng 1 tháng kể từ hôm nay");
    } else {
      setDateError("");
    }
  };

  const handleInitiatePayment = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để tiếp tục thanh toán");
      return;
    }
    setLoading(true);
    try {
      const orderDetails = items.map((item) => ({
        serviceID: item.id,
        quantity: item.quantity,
      }));

      const totalAmount = calculateTotal();

      localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
      localStorage.setItem("nicheID", nicheID.toString());
      localStorage.setItem("orderDate", orderDate);

      const paymentResponse = await PaymentService.createPayment({
        amount: totalAmount.toString(),
        orderId: new Date().getTime().toString(),
      });

      if (paymentResponse.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error("Failed to create payment URL");
      }
    } catch (error) {
      console.error("Error creating payment URL:", error);
      toast.error("Không thể tạo URL thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNiches = async () => {
      if (isOpen) {
        setNichesLoading(true);
        try {
          const response = await NicheAPI.getNichesForCustomer();
          setNiches(response.data.$values);
        } catch (error) {
          console.error("Failed to fetch niches. Please try again later.");
        } finally {
          setNichesLoading(false);
        }
      }
    };

    fetchNiches();
  }, [isOpen]);

  const totalAmount = calculateTotal();
  const isPaymentDisabled =
    !nicheID || !orderDate || items.length === 0 || !!dateError;

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleOpenChange(false)}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Giỏ Hàng Của Bạn</DialogTitle>
      <DialogContent>
        {items.length > 0 ? (
          <div>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <Typography variant="body1" color="textPrimary">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </Typography>
                      <div className="flex items-center mt-2">
                        <IconButton
                          size="small"
                          onClick={() => handleDecreaseQuantity(item)}
                          color="error"
                        >
                          <RemoveCircleIcon />
                        </IconButton>
                        <span className="mx-2">{item.quantity}</span>
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => handleIncreaseQuantity(item)}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <IconButton
                    color="error"
                    size="medium"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </li>
              ))}
            </ul>
            <Box mt={4} borderTop={1} borderColor="grey.300" pt={2}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6" color="textPrimary">
                  Tổng cộng
                </Typography>
                <Typography variant="h6" color="textPrimary">
                  {totalAmount.toLocaleString()} ₫
                </Typography>
              </Box>
              {user ? (
                isNichesLoading ? (
                  <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TextField
                      select
                      label="Ô chứa"
                      value={nicheID}
                      onChange={(e) => setNicheID(Number(e.target.value))}
                      fullWidth
                      margin="normal"
                    >
                      {niches.map((niche) => (
                        <MenuItem key={niche.nicheId} value={niche.nicheId}>
                          {niche.nicheAddress}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Ngày hẹn"
                      type="datetime-local"
                      fullWidth
                      value={orderDate}
                      onChange={handleDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      error={!!dateError}
                      helperText={dateError}
                    />
                  </>
                )
              ) : (
                <Typography
                  variant="body1"
                  color="error"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  <Tooltip title="Đăng nhập">
                    <Link href="/auth/login">
                      Bạn cần đăng nhập để có thể tiếp tục thanh toán
                    </Link>
                  </Tooltip>
                </Typography>
              )}
            </Box>
          </div>
        ) : (
          <Typography align="center" color="textSecondary">
            Giỏ hàng của bạn trống.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)} variant="outlined">
          Đóng
        </Button>
        <Button
          onClick={handleInitiatePayment}
          color="primary"
          variant="contained"
          disabled={!user || isPaymentDisabled || loading}
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartModal;
