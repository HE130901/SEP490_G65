// src/pages/ServiceSummaryPage.tsx
"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import { useDashboardContext } from "@/context/DashboardContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper function to filter keys
const filterKeys = (obj: Record<string, any>): Record<string, any> =>
  Object.keys(obj).reduce((acc, key) => {
    if (!key.startsWith("$")) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Record<string, any>);

const ServiceSummaryPage: React.FC = () => {
  const { serviceReport } = useDashboardContext();

  if (!serviceReport) {
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

  // Data for Bar Chart (Services by Category)
  const servicesByCategoryData = {
    labels: Object.keys(filterKeys(serviceReport.servicesByCategory)),
    datasets: [
      {
        label: "Số lượng dịch vụ",
        data: Object.values(filterKeys(serviceReport.servicesByCategory)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Pie Chart (Revenue by Category)
  const revenueByCategoryData = {
    labels: Object.keys(filterKeys(serviceReport.revenueByCategory)),
    datasets: [
      {
        label: "Doanh thu",
        data: Object.values(filterKeys(serviceReport.revenueByCategory)),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for Bar Chart (Services by Status)
  const servicesByStatusData = {
    labels: Object.keys(filterKeys(serviceReport.servicesByStatus)),
    datasets: [
      {
        label: "Số lượng dịch vụ",
        data: Object.values(filterKeys(serviceReport.servicesByStatus)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Báo cáo tổng quan dịch vụ
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Tổng doanh thu
              </Typography>
              <Typography variant="h4">
                {serviceReport.totalRevenue.toLocaleString()} VND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Giá trị đơn hàng trung bình
              </Typography>
              <Typography variant="h4">
                {serviceReport.averageOrderValue.toLocaleString()} VND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Tổng số đơn đặt dịch vụ
              </Typography>
              <Typography variant="h4">
                {serviceReport.totalServices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Dịch vụ theo danh mục
              </Typography>
              <Box sx={{ position: "relative", width: "100%" }}>
                <Bar
                  data={servicesByCategoryData}
                  options={{ responsive: true }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Doanh thu theo danh mục
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  height: { xs: "200px", sm: "300px" },
                  maxHeight: "300px",
                }}
              >
                <Pie
                  data={revenueByCategoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Dịch vụ theo trạng thái
              </Typography>
              <Box sx={{ position: "relative", width: "100%" }}>
                <Bar
                  data={servicesByStatusData}
                  options={{ responsive: true }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceSummaryPage;
