"use client";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axiosInstance from "@/utils/axiosInstance";

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
}

interface NicheReportData {
  availableNiches: number;
  reservedNiches: number;
  occupiedNiches: number;
  totalNiches: number;
  nichesByArea: NicheArea[];
}

function NicheReportPage() {
  const [reportData, setReportData] = useState<NicheReportData | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8; // Set the number of rows per page

  useEffect(() => {
    axiosInstance
      .get("/api/Report/niche-summary")
      .then((response) => {
        if (
          response.data &&
          response.data.nichesByArea &&
          response.data.nichesByArea.$values
        ) {
          setReportData({
            ...response.data,
            nichesByArea: response.data.nichesByArea.$values,
          });
        } else {
          console.error("Unexpected API response structure:", response);
        }
      })
      .catch((error) => console.error("Error fetching report data:", error));
  }, []);

  if (!reportData) {
    return <Typography>Loading...</Typography>;
  }

  const handlePageChange = (event: any, value: number) => {
    setPage(value);
  };

  // Sort nichesByArea by areaId in ascending order
  const sortedAreas = reportData.nichesByArea.sort(
    (a, b) => a.areaId - b.areaId
  );

  // Paginate the sorted areas
  const paginatedAreas = sortedAreas.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Pie chart data
  const pieChartData = {
    labels: ["Ô chứa Đang sử dụng", "Ô chứa Đã đặt trước", "Ô chứa Trống"],
    datasets: [
      {
        label: "Số lượng Ô chứa",
        data: [
          reportData.occupiedNiches,
          reportData.reservedNiches,
          reportData.availableNiches,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
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
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng số Ô chứa</Typography>
              <Typography variant="h4">{reportData.totalNiches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ô chứa Đang sử dụng</Typography>
              <Typography variant="h4">{reportData.occupiedNiches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ô chứa Đã đặt trước</Typography>
              <Typography variant="h4">{reportData.reservedNiches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ô chứa Trống</Typography>
              <Typography variant="h4">{reportData.availableNiches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Phân tích theo Khu vực</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Khu vực</TableCell>
                      <TableCell align="right">Tổng số Ô chứa</TableCell>
                      <TableCell align="right">Đang sử dụng</TableCell>
                      <TableCell align="right">Đã đặt trước</TableCell>
                      <TableCell align="right">Trống</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={Math.ceil(reportData.nichesByArea.length / rowsPerPage)}
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
}

export default NicheReportPage;
