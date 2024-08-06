// Dashboard.tsx
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
import { useDashboardContext } from "@/context/DashboardContext";
import withAuth from "@/components/withAuth";

const Dashboard: React.FC = () => {
  const { nicheReport, serviceReport, contractReport, pendingOrdersSummary } =
    useDashboardContext();

  if (
    !nicheReport ||
    !serviceReport ||
    !contractReport ||
    !pendingOrdersSummary
  ) {
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Các đơn đang chờ xử lý
      </Typography>
      <Grid container spacing={3}>
        {pendingOrdersSummary.map((order) => (
          <Grid item xs={12} md={4} key={order.type}>
            <Card>
              <CardContent>
                <Typography variant="h6">{order.type}</Typography>
                <Typography variant="h4">{order.count} đơn</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default withAuth(Dashboard);
