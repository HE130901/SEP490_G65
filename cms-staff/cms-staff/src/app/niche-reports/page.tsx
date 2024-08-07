// src/pages/NicheReportPage.tsx
"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { useDashboardContext } from "@/context/DashboardContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define the data structure
interface NicheArea {
  areaAddress: string;
  areaId: number;
  count: number;
  occupied: number;
  reserved: number;
  available: number;
  unavailable: number;
}

interface NicheReportData {
  availableNiches: number;
  reservedNiches: number;
  occupiedNiches: number;
  unavailableNiches: number;
  totalNiches: number;
  nichesByArea: NicheArea[];
}

const NicheReportPage: React.FC = () => {
  const { nicheReport } = useDashboardContext();
  const [page, setPage] = useState(1);
  const rowsPerPage = 8; // Set the number of rows per page

  if (!nicheReport) {
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

  const handlePageChange = (event: any, value: number) => {
    setPage(value);
  };

  // Sort nichesByArea by areaId in ascending order
  const sortedAreas = nicheReport.nichesByArea.sort(
    (a, b) => a.areaId - b.areaId
  );

  // Paginate the sorted areas
  const paginatedAreas = sortedAreas.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Pie chart data
  const pieChartData = {
    labels: [
      "Ô chứa Đang sử dụng",
      "Ô chứa Đã đặt trước",
      "Ô chứa Trống",
      "Ô chứa Không khả dụng",
    ],
    datasets: [
      {
        label: "Số lượng Ô chứa",
        data: [
          nicheReport.occupiedNiches,
          nicheReport.reservedNiches,
          nicheReport.availableNiches,
          nicheReport.unavailableNiches,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Báo cáo tổng quan Ô chứa
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12 / 5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng số Ô chứa</Typography>
              <Typography variant="h4">{nicheReport.totalNiches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12 / 5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Đang sử dụng</Typography>
              <Typography variant="h4">{nicheReport.occupiedNiches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12 / 5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Đang được đặt</Typography>
              <Typography variant="h4">{nicheReport.reservedNiches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12 / 5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Còn trống</Typography>
              <Typography variant="h4">
                {nicheReport.availableNiches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12 / 5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Không khả dụng</Typography>
              <Typography variant="h4">
                {nicheReport.unavailableNiches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng quan Ô chứa</Typography>
              <Box
                sx={{
                  position: "relative",
                  height: "300px",
                  maxHeight: "300px",
                }}
              >
                <Pie
                  data={pieChartData}
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
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Số liệu theo Khu</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Khu vực</TableCell>
                      <TableCell align="right">Tổng số Ô chứa</TableCell>
                      <TableCell align="right">Đang sử dụng</TableCell>
                      <TableCell align="right">Đã đặt trước</TableCell>
                      <TableCell align="right">Trống</TableCell>
                      <TableCell align="right">Không khả dụng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAreas.map((area) => (
                      <TableRow key={area.areaId}>
                        <TableCell>{area.areaAddress}</TableCell>
                        <TableCell align="right">{area.count}</TableCell>
                        <TableCell align="right">{area.occupied}</TableCell>
                        <TableCell align="right">{area.reserved}</TableCell>
                        <TableCell align="right">{area.available}</TableCell>
                        <TableCell align="right">{area.unavailable}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={Math.ceil(nicheReport.nichesByArea.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NicheReportPage;
