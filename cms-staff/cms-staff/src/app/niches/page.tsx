"use client";

import React, { useState } from "react";
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

const buildings = [
  {
    id: 1,
    name: "Tòa nhà A",
    floors: [
      {
        id: 1,
        name: "Tầng 1",
        zones: [
          {
            id: 1,
            name: "Khu 1",
            niches: [
              {
                id: 1,
                code: "N001",
                customer: "Nguyễn Văn A",
                phone: "0123456789",
                deceased: "Nguyễn Văn B",
                status: "Đang sử dụng",
                history: "Hợp đồng 32323, 12323",
              },
              {
                id: 2,
                code: "N002",
                customer: "",
                phone: "",
                deceased: "",
                status: "Còn trống",
                history: "Không có",
              },
              {
                id: 3,
                code: "N003",
                customer: "ABCD",
                phone: "0987654321",
                deceased: "",
                status: "Đang được đặt",
                history: "Không có",
              },
              {
                id: 4,
                code: "N004",
                customer: "Nguyễn Văn C",
                phone: "0912345678",
                deceased: "Nguyễn Văn D",
                status: "Đã quá hạn HĐ",
                history: "Hợp đồng 23233",
              },
            ],
          },
          {
            id: 2,
            name: "Khu 2",
            niches: [
              {
                id: 5,
                code: "N005",
                customer: "Lê Văn E",
                phone: "0987654321",
                deceased: "Lê Thị F",
                status: "Đang được đặt",
                history: "Hợp đồng 12334",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Tầng 2",
        zones: [
          {
            id: 6,
            name: "Khu 3",
            niches: [
              {
                id: 7,
                code: "N006",
                customer: "",
                phone: "",
                deceased: "",
                status: "Còn trống",
                history: "Không có",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Tòa nhà B",
    floors: [
      {
        id: 3,
        name: "Tầng 1",
        zones: [
          {
            id: 8,
            name: "Khu 4",
            niches: [
              {
                id: 9,
                code: "N007",
                customer: "Hoàng Văn J",
                phone: "0234567891",
                deceased: "Hoàng Thị K",
                status: "Đang sử dụng",
                history: "Hợp đồng 123321",
              },
            ],
          },
        ],
      },
    ],
  },
];

const NicheManagementPage = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [niches, setNiches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

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

  const handleZoneChange = (event) => {
    const zoneId = event.target.value;
    setSelectedZone(zoneId);

    const building = buildings.find((b) => b.id === parseInt(selectedBuilding));
    const floor = building.floors.find((f) => f.id === parseInt(selectedFloor));
    const zone = floor.zones.find((z) => z.id === parseInt(zoneId));
    setNiches(zone.niches);
  };

  const handleViewNiche = (id) => {
    alert(`Xem chi tiết ô chứa với ID: ${id}`);
  };

  const handleEditNiche = (id) => {
    alert(`Sửa ô chứa với ID: ${id}`);
  };

  const handleSearchColumnChange = (event) => {
    setSearchColumn(event.target.value);
  };

  const filteredNiches = niches.filter((niche) => {
    if (searchColumn === "all") {
      return (
        niche.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niche.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niche.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niche.deceased.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niche.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niche.history.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchColumn === "code") {
      return niche.code.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "customer") {
      return niche.customer.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "phone") {
      return niche.phone.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "deceased") {
      return niche.deceased.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "status") {
      return niche.status.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchColumn === "history") {
      return niche.history.toLowerCase().includes(searchTerm.toLowerCase());
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
              {buildings.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name}
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
                buildings
                  .find(
                    (building) => building.id === parseInt(selectedBuilding)
                  )
                  .floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id}>
                      {floor.name}
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
                buildings
                  .find(
                    (building) => building.id === parseInt(selectedBuilding)
                  )
                  .floors.find((floor) => floor.id === parseInt(selectedFloor))
                  .zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
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
              <TableRow key={niche.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{niche.code}</TableCell>
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
                    onClick={() => handleViewNiche(niche.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleEditNiche(niche.id)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NicheManagementPage;
