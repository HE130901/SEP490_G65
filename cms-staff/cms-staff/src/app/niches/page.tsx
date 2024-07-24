// src/components/NicheListWithSelectors.tsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import ViewNicheDialog from "./ViewNicheDialog";
import EditNicheDialog from "./EditNicheDialog";

interface NicheHistoryDto {
  contractId: number;
  startDate: string;
  endDate: string;
}

interface NicheDtoForStaff {
  nicheId: number;
  nicheName: string;
  customerName?: string;
  deceasedName?: string;
  description?: string;
  nicheHistories: { $values: NicheHistoryDto[] };
  status?: string;
}

const NicheListWithSelectors: React.FC = () => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [niches, setNiches] = useState<NicheDtoForStaff[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNicheId, setSelectedNicheId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axiosInstance.get("/api/Locations/buildings");
        const buildingsData = response.data.$values;
        setBuildings(buildingsData);
        if (buildingsData.length > 0) {
          setSelectedBuilding(buildingsData[0].buildingId);
        }
      } catch (error) {
        toast.error("Unable to fetch buildings");
      }
    };

    fetchBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuilding !== null) {
      const fetchFloors = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/Locations/floors/${selectedBuilding}`
          );
          const floorsData = response.data.$values;
          setFloors(floorsData);
          if (floorsData.length > 0) {
            setSelectedFloor(floorsData[0].floorId);
          }
        } catch (error) {
          toast.error("Unable to fetch floors");
        }
      };

      fetchFloors();
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedFloor !== null) {
      const fetchAreas = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/Locations/areas/${selectedFloor}`
          );
          const areasData = response.data.$values;
          setAreas(areasData);
          if (areasData.length > 0) {
            setSelectedArea(areasData[0].areaId);
          }
        } catch (error) {
          toast.error("Unable to fetch areas");
        }
      };

      fetchAreas();
    }
  }, [selectedFloor]);

  useEffect(() => {
    if (selectedArea !== null) {
      const fetchNiches = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/api/StaffNiches/area/${selectedArea}`
          );
          setNiches(response.data.$values); // Accessing the $values property
        } catch (error) {
          toast.error("Unable to fetch niches");
        } finally {
          setLoading(false);
        }
      };

      fetchNiches();
    }
  }, [selectedArea]);

  const handleViewNiche = (nicheId: number) => {
    setSelectedNicheId(nicheId);
    setViewDialogOpen(true);
  };

  const handleEditNiche = (nicheId: number) => {
    setSelectedNicheId(nicheId);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    if (selectedArea !== null) {
      const fetchNiches = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/api/StaffNiches/area/${selectedArea}`
          );
          setNiches(response.data.$values); // Accessing the $values property
        } catch (error) {
          toast.error("Unable to fetch niches");
        } finally {
          setLoading(false);
        }
      };

      fetchNiches();
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl margin="normal" style={{ flex: 1, marginRight: 8 }}>
          <InputLabel id="building-select-label">Building</InputLabel>
          <Select
            labelId="building-select-label"
            value={selectedBuilding || ""}
            onChange={(e) => setSelectedBuilding(e.target.value as number)}
          >
            {buildings.map((building) => (
              <MenuItem key={building.buildingId} value={building.buildingId}>
                {building.buildingName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl margin="normal" style={{ flex: 1, marginRight: 8 }}>
          <InputLabel id="floor-select-label">Floor</InputLabel>
          <Select
            labelId="floor-select-label"
            value={selectedFloor || ""}
            onChange={(e) => setSelectedFloor(e.target.value as number)}
          >
            {floors.map((floor) => (
              <MenuItem key={floor.floorId} value={floor.floorId}>
                {floor.floorName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl margin="normal" style={{ flex: 1 }}>
          <InputLabel id="area-select-label">Area</InputLabel>
          <Select
            labelId="area-select-label"
            value={selectedArea || ""}
            onChange={(e) => setSelectedArea(e.target.value as number)}
          >
            {areas.map((area) => (
              <MenuItem key={area.areaId} value={area.areaId}>
                {area.areaName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        selectedArea && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Niche ID</TableCell>
                  <TableCell>Niche Name</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Deceased Name</TableCell>
                  <TableCell>Contract History</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {niches.map((niche, index) => (
                  <TableRow key={niche.nicheId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{niche.nicheId}</TableCell>
                    <TableCell>{niche.nicheName}</TableCell>
                    <TableCell>{niche.customerName ?? "N/A"}</TableCell>
                    <TableCell>{niche.deceasedName ?? "N/A"}</TableCell>
                    <TableCell>
                      {niche.nicheHistories.$values.length > 0
                        ? niche.nicheHistories.$values.map((history) => (
                            <div key={history.contractId}>
                              <p>Contract ID: {history.contractId}</p>
                              <p>Start Date: {history.startDate}</p>
                              <p>End Date: {history.endDate}</p>
                            </div>
                          ))
                        : "No history"}
                    </TableCell>
                    <TableCell>{niche.status ?? "N/A"}</TableCell>
                    <TableCell>{niche.description ?? "N/A"}</TableCell>

                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewNiche(niche.nicheId)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEditNiche(niche.nicheId)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      <ViewNicheDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        nicheId={selectedNicheId}
      />
      <EditNicheDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        nicheId={selectedNicheId}
        onSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default NicheListWithSelectors;
