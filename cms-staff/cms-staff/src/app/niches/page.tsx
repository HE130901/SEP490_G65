// NicheList.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import ViewNicheDialog from "./ViewNicheDialog";
import EditNicheDialog from "./EditNicheDialog";
import { styled } from "@mui/material/styles";
import viVN from "@/utils/viVN";
import { useNiches } from "@/context/NicheContext"; // Import useNiches

const CenteredTable = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
  },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    textOverflow: "unset",
    padding: theme.spacing(1),
    wordBreak: "break-word",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
  },
}));

const NicheList: React.FC = () => {
  const { niches, fetchNiches } = useNiches();
  const [buildings, setBuildings] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
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
        toast.error("Không thể tải danh sách tòa nhà");
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
          toast.error("Không thể tải danh sách tầng");
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
          toast.error("Không thể tải danh sách khu vực");
        }
      };

      fetchAreas();
    }
  }, [selectedFloor]);

  useEffect(() => {
    if (selectedArea !== null) {
      setLoading(true);
      fetchNiches(selectedArea);
      setLoading(false);
    }
  }, [selectedArea, fetchNiches]);

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
      fetchNiches(selectedArea);
    }
  };

  const columns: GridColDef[] = [
    { field: "nicheId", headerName: "ID", width: 80 },
    { field: "nicheName", headerName: "Tên ô chứa", width: 180 },
    { field: "customerName", headerName: "Tên khách hàng", width: 180 },
    { field: "deceasedName", headerName: "Tên người đã mất", width: 180 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    { field: "description", headerName: "Mô tả", width: 250 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Xem chi tiết">
            <IconButton
              color="primary"
              onClick={() => handleViewNiche(params.row.nicheId)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              color="secondary"
              onClick={() => handleEditNiche(params.row.nicheId)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const rows = niches.map((niche, index) => ({
    id: index + 1,
    ...niche,
  }));

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl margin="normal" style={{ flex: 1, marginRight: 8 }}>
          <InputLabel id="building-select-label">Tòa nhà</InputLabel>
          <Select
            labelId="building-select-label"
            value={selectedBuilding || ""}
            onChange={(e) => setSelectedBuilding(e.target.value as number)}
            label="Tòa nhà"
          >
            {buildings.map((building) => (
              <MenuItem key={building.buildingId} value={building.buildingId}>
                {building.buildingName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl margin="normal" style={{ flex: 1, marginRight: 8 }}>
          <InputLabel id="floor-select-label">Tầng</InputLabel>
          <Select
            label="Tầng"
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
          <InputLabel id="area-select-label">Khu </InputLabel>
          <Select
            label="Khu "
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
          <Paper elevation={3} style={{ padding: 20 }}>
            <CenteredTable
              rows={rows}
              columns={columns}
              autoHeight
              localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
              pageSizeOptions={[10]}
            />
          </Paper>
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

export default NicheList;
