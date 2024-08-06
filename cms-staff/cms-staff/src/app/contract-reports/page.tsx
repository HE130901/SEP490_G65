// src/pages/ContractSummaryPage.tsx
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

// Function to get the label and color for each status
const getStatusLabel = (status: string) => {
  switch (status) {
    case "Canceled":
      return { label: "Đã thanh lý", color: "error" };
    case "Expired":
      return { label: "Đã hết hạn", color: "error" };
    case "Active":
      return { label: "Còn hiệu lực", color: "success" };
    case "Extended":
      return { label: "Đã gia hạn", color: "success" };
    case "NearlyExpired":
      return { label: "Gần hết hạn", color: "warning" };
    case "PendingRenewal":
      return { label: "Chờ gia hạn", color: "warning" };
    case "PendingCancellation":
      return { label: "Chờ thanh lý", color: "warning" };
    default:
      return { label: status, color: "default" };
  }
};

const ContractSummaryPage: React.FC = () => {
  const { contractReport } = useDashboardContext();

  if (!contractReport) {
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

  // Data for Bar Chart (Contract Status Counts)
  const contractStatusData = {
    labels: contractReport.contractsByStatus.$values.map(
      (status) => getStatusLabel(status.status).label
    ),
    datasets: [
      {
        label: "Số lượng hợp đồng",
        data: contractReport.contractsByStatus.$values.map(
          (status) => status.count
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Pie Chart (Revenue Distribution by Status)
  const revenueData = {
    labels: contractReport.contractsByStatus.$values.map(
      (status) => getStatusLabel(status.status).label
    ),
    datasets: [
      {
        label: "Tổng số tiền",
        data: contractReport.contractsByStatus.$values.map(
          (status) => status.totalAmount
        ),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Báo cáo tổng quan hợp đồng
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Tổng doanh thu
              </Typography>
              <Typography variant="h4">
                {contractReport.totalRevenue.toLocaleString()} VND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Giá trị hợp đồng trung bình
              </Typography>
              <Typography variant="h4">
                {contractReport.averageContractValue.toLocaleString()} VND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Tổng số hợp đồng
              </Typography>
              <Typography variant="h4">
                {contractReport.totalContracts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Hợp đồng đang hoạt động
              </Typography>
              <Typography variant="h4">
                {contractReport.activeContracts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Hợp đồng theo trạng thái
              </Typography>
              <Bar data={contractStatusData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Phân phối doanh thu theo trạng thái
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  height: "300px",
                  maxHeight: "300px",
                }}
              >
                <Pie
                  data={revenueData}
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
      </Grid>
    </Box>
  );
};

export default ContractSummaryPage;
