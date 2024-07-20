"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import VisitViewDialog from "./VisitViewDialog";
import VisitEditDialog from "./VisitEditDialog";
import VisitDeleteDialog from "./VisitDeleteDialog";
import VisitAddDialog from "./VisitAddDialog";

interface VisitRegistrationDto {
  visitId: number;
  customerId: number;
  nicheId: number;
  customerName: string;
  staffName: string;
  nicheAddress: string;
  createdDate: string;
  visitDate: string;
  status: string;
  accompanyingPeople: number;
  note: string;
  approvedBy?: number;
}

const VisitRegistrationsList: React.FC = () => {
  const [visitRegistrations, setVisitRegistrations] = useState<
    VisitRegistrationDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] =
    useState<VisitRegistrationDto | null>(null);

  useEffect(() => {
    fetchVisitRegistrations();
  }, []);

  const fetchVisitRegistrations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/VisitRegistrations");
      setVisitRegistrations(response.data.$values);
    } catch (error) {
      toast.error("Unable to fetch visit registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit);
    setViewDialogOpen(true);
  };

  const handleEdit = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit);
    setEditDialogOpen(true);
  };

  const handleDelete = (visit: VisitRegistrationDto) => {
    setSelectedVisit(visit);
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const closeDialogs = () => {
    setViewDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedVisit(null);
    fetchVisitRegistrations();
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Visit Registration
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell>Visit ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Staff Name</TableCell>
                <TableCell>Niche Address</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Visit Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Accompanying People</TableCell>
                <TableCell>Note</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visitRegistrations.map((visit, index) => (
                <TableRow key={visit.visitId}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{visit.visitId}</TableCell>
                  <TableCell>{visit.customerName}</TableCell>
                  <TableCell>{visit.staffName}</TableCell>
                  <TableCell>{visit.nicheAddress}</TableCell>
                  <TableCell>
                    {new Date(visit.createdDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(visit.visitDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{visit.status}</TableCell>
                  <TableCell>{visit.accompanyingPeople}</TableCell>
                  <TableCell>{visit.note}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleView(visit)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleEdit(visit)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(visit)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialogs for View, Edit, and Delete */}
      <VisitViewDialog
        open={viewDialogOpen}
        visit={selectedVisit}
        onClose={closeDialogs}
      />
      <VisitEditDialog
        open={editDialogOpen}
        visit={selectedVisit}
        onClose={closeDialogs}
      />
      <VisitDeleteDialog
        open={deleteDialogOpen}
        visit={selectedVisit}
        onClose={closeDialogs}
      />
      <VisitAddDialog open={addDialogOpen} onClose={closeDialogs} />
    </Box>
  );
};

export default VisitRegistrationsList;
