"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { usePendingOrdersContext } from "@/context/PendingOrdersContext";

const Dashboard: React.FC = () => {
  const { pendingOrdersSummary, loading } = usePendingOrdersContext();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Quick Access Links with Images
  const quickAccessLinks = [
    { text: "Hợp đồng", path: "/contracts", image: "/images/contract.webp" },
    { text: "Khách hàng", path: "/customers", image: "/images/customers.webp" },
    { text: "Ô chứa", path: "/niches", image: "/images/niches.webp" },
    {
      text: "Dịch vụ & sản phẩm",
      path: "/services",
      image: "/images/services.webp",
    },
  ];

  // Mapping order types to their respective paths
  const orderTypePathMap: { [key: string]: string } = {
    "Đơn đăng ký viếng": "/visit-registrations",
    "Đơn đặt ô chứa": "/niche-reservations",
    "Đơn đặt dịch vụ": "/service-requests",
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Các đơn đang chờ xử lý
      </Typography>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        {pendingOrdersSummary.map((order) => {
          const displayText = order.type;
          const path = orderTypePathMap[order.type] || "#";

          return (
            <Grid item xs={12} md={4} key={order.type}>
              <Link href={path} passHref>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.02)",
                      transition: "transform 0.2s ease-in-out",
                    },
                    borderRadius: 2,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {displayText}
                    </Typography>
                    <Typography variant="h4" sx={{ color: "primary.main" }}>
                      {order.count} đơn
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mt: 4 }}>
        Truy cập nhanh
      </Typography>
      <Grid container spacing={3}>
        {quickAccessLinks.map((link) => (
          <Grid item xs={12} md={3} key={link.text}>
            <Link href={link.path} passHref>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                  },
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={link.image}
                  alt={link.text}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {link.text}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
