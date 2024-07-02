"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import buildingService from "@/services/buildingService";
import NicheViewDialog from "./NicheViewDialog";
import NicheEditDialog from "./NicheEditDialog";

const NicheManagementPage = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [niches, setNiches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await buildingService.getAllBuildingsFloorsAreas();
        setBuildings(
          response.data.buildings.$values || response.data.buildings || []
        );
      } catch (error) {
        console.error("Error fetching buildings data:", error);
      }
    };

    fetchBuildings();
  }, []);

  const handleBuildingChange = (event) => {
    const buildingId = event.target.value;
    setSelectedBuilding(buildingId);
    setSelectedFloor("");
    setSelectedZone("");
    setNiches([]);
  };

  const handleFloorChange = (event) => {
    const floorId = event.target.value;
    setSelectedFloor(floorId);
    setSelectedZone("");
    setNiches([]);
  };

  const handleZoneChange = async (event) => {
    const zoneId = event.target.value;
    setSelectedZone(zoneId);

    try {
      const response = await buildingService.getNiches(
        selectedBuilding,
        selectedFloor,
        zoneId
      );
      setNiches(response.data.$values || response.data); // Ensure proper data access
    } catch (error) {
      console.error("Error fetching niches data:", error);
    }
  };

  const handleViewNiche = (niche) => {
    setSelectedNiche(niche);
    setViewDialogOpen(true);
  };

  const handleEditNiche = (niche) => {
    setSelectedNiche(niche);
    setEditDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedNiche(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedNiche(null);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const filteredNiches = niches.filter((niche) => {
    if (searchColumn === "all") {
      return (
        niche.nicheName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        niche.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        niche.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        niche.deceased?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        niche.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        "" ||
        niche.history?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
      );
    } else if (searchColumn === "code") {
      return niche.nicheName?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "customer") {
      return niche.customer?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "phone") {
      return niche.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "deceased") {
      return niche.deceased?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "status") {
      return niche.status?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "history") {
      return niche.history?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <FormControl
            variant="outlined"
            sx={{ minWidth: 150, marginRight: 2 }}
          >
            <InputLabel>Tòa nhà</InputLabel>
            <Select
              value={selectedBuilding}
              onChange={handleBuildingChange}
              label="Tòa nhà"
            >
              {Array.isArray(buildings) &&
                buildings.map((building) => (
                  <MenuItem
                    key={building.buildingId}
                    value={building.buildingId}
                  >
                    {building.buildingName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ minWidth: 150, marginRight: 2 }}
            disabled={!selectedBuilding}
          >
            <InputLabel>Tầng</InputLabel>
            <Select
              value={selectedFloor}
              onChange={handleFloorChange}
              label="Tầng"
            >
              {selectedBuilding &&
                Array.isArray(buildings) &&
                buildings
                  .find(
                    (building) =>
                      building.buildingId === parseInt(selectedBuilding)
                  )
                  ?.floors.$values?.map((floor) => (
                    <MenuItem key={floor.floorId} value={floor.floorId}>
                      {floor.floorName}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ minWidth: 150, marginRight: 2 }}
            disabled={!selectedFloor}
          >
            <InputLabel>Khu</InputLabel>
            <Select
              value={selectedZone}
              onChange={handleZoneChange}
              label="Khu"
            >
              {selectedFloor &&
                Array.isArray(buildings) &&
                buildings
                  .find(
                    (building) =>
                      building.buildingId === parseInt(selectedBuilding)
                  )
                  ?.floors.$values.find(
                    (floor) => floor.floorId === parseInt(selectedFloor)
                  )
                  ?.areas.$values?.map((zone) => (
                    <MenuItem key={zone.areaId} value={zone.areaId}>
                      {zone.areaName}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center">
          <FormControl
            variant="outlined"
            sx={{ minWidth: 150, marginRight: 2 }}
          >
            <InputLabel>Tìm theo</InputLabel>
            <Select
              value={searchColumn}
              onChange={handleSearchColumnChange}
              label="Tìm theo"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="code">Mã</MenuItem>
              <MenuItem value="customer">Khách hàng</MenuItem>
              <MenuItem value="phone">Số điện thoại</MenuItem>
              <MenuItem value="deceased">Người mất</MenuItem>
              <MenuItem value="status">Trạng thái</MenuItem>
              <MenuItem value="history">Lịch sử</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Người mất</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Lịch sử</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNiches.map((niche, index) => (
              <TableRow key={niche.nicheId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{niche.nicheName}</TableCell>
                <TableCell>{niche.customer}</TableCell>
                <TableCell>{niche.phone}</TableCell>
                <TableCell>{niche.deceased}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      niche.status === "Đang sử dụng"
                        ? "Đang sử dụng"
                        : niche.status === "Còn trống"
                        ? "Còn trống"
                        : niche.status === "Đang được đặt"
                        ? "Đang được đặt"
                        : "Đã quá hạn HĐ"
                    }
                    color={
                      niche.status === "Đang sử dụng"
                        ? "success"
                        : niche.status === "Còn trống"
                        ? "default"
                        : niche.status === "Đang được đặt"
                        ? "warning"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell>{niche.history}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewNiche(niche)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditNiche(niche)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <NicheViewDialog
        open={viewDialogOpen}
        niche={selectedNiche}
        onClose={handleViewDialogClose}
      />
      <NicheEditDialog
        open={editDialogOpen}
        niche={selectedNiche}
        onClose={handleEditDialogClose}
      />
    </Box>
  );
};

export default NicheManagementPage;
