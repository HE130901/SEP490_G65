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
} from "@mui/material";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import PaymentService from "@/services/paymentService";
import { toast } from "react-toastify";
import NicheAPI from "@/services/nicheService";
import ItemType from "./ItemType";

interface CartModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface Niche {
  nicheId: number;
  nicheName: string;
}

const CartModal = ({ isOpen, setIsOpen }: CartModalProps) => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [nicheID, setNicheID] = useState<number>(1);
  const [orderDate, setOrderDate] = useState<string>("");
  const [niches, setNiches] = useState<Niche[]>([]);
  const [isNichesLoading, setNichesLoading] = useState<boolean>(true);

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

  const handleInitiatePayment = async () => {
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
      try {
        const response = await NicheAPI.getNichesForCustomer();
        setNiches(response.data.$values);
      } catch (error) {
        toast.error("Failed to fetch niches. Please try again later.");
      } finally {
        setNichesLoading(false);
      }
    };

    if (isOpen) {
      fetchNiches();
    }
  }, [isOpen]);

  const totalAmount = calculateTotal();
  const isPaymentDisabled = !nicheID || !orderDate || items.length === 0;

  return (
    <Dialog
      open={isOpen}
      onClose={() => handleOpenChange(false)}
      fullWidth
      maxWidth="sm"
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
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <Typography variant="body1" color="textPrimary">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </Typography>
                      <div className="flex items-center mt-2">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDecreaseQuantity(item)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleIncreaseQuantity(item)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <IconButton onClick={() => removeFromCart(item.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
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
              {isNichesLoading ? (
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
                        {niche.nicheName}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Ngày hẹn"
                    type="datetime-local"
                    fullWidth
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />
                </>
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
        <Button onClick={() => setIsOpen(false)} color="primary">
          Đóng
        </Button>
        <Button
          onClick={handleInitiatePayment}
          color="primary"
          variant="contained"
          disabled={isPaymentDisabled || loading}
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartModal;
