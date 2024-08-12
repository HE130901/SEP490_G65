"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import ViewNicheDialog from "./ViewNicheDialog";
import EditNicheDialog from "./EditNicheDialog";
import { styled } from "@mui/material/styles";
import { viVN } from "@/utils/viVN";
import { useNiches } from "@/context/NicheContext";
import CustomTablePagination from "@/components/ui/CustomTablePagination";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Active":
      return { label: "Đang hoạt động", color: "info" };
    case "Unavailable":
      return { label: "Ngừng bán", color: "error" };
    case "Available":
      return { label: "Còn trống", color: "success" };
    case "Booked":
      return { label: "Đã được đặt", color: "warning" };
    default:
      return { label: status, color: "default" };
  }
};

const CenteredCell = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
});

const CenteredTable = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
  },
  "& .MuiDataGrid-cell": {
    display: "flex",
    padding: theme.spacing(1),
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  "& .MuiDataGrid-columnHeader": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  "& .MuiDataGrid-row": {
    maxHeight: "none !important",
  },
  "& .MuiDataGrid-renderingZone": {
    maxHeight: "none !important",
  },
  "& .MuiDataGrid-row--lastVisible": {
    maxHeight: "none !important",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

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
      fetchNiches(selectedArea).finally(() => setLoading(false));
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

  const handleSearchColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value);
  };

  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const filteredNiches = niches.filter((niche) => {
    const searchTermLower = removeAccents(searchTerm.toLowerCase());

    if (searchColumn === "all") {
      return (
        removeAccents(niche.nicheCode.toLowerCase()).includes(
          searchTermLower
        ) ||
        removeAccents(niche.customerName?.toLowerCase() || "").includes(
          searchTermLower
        ) ||
        removeAccents(niche.deceasedName?.toLowerCase() || "").includes(
          searchTermLower
        ) ||
        removeAccents(
          getStatusLabel(niche.status ?? "").label.toLowerCase()
        ).includes(searchTermLower) ||
        removeAccents(niche.description?.toLowerCase() || "").includes(
          searchTermLower
        )
      );
    } else if (searchColumn === "nicheCode") {
      return removeAccents(niche.nicheCode.toLowerCase()).includes(
        searchTermLower
      );
    } else if (searchColumn === "customerName") {
      return removeAccents(niche.customerName?.toLowerCase() || "").includes(
        searchTermLower
      );
    } else if (searchColumn === "deceasedName") {
      return removeAccents(niche.deceasedName?.toLowerCase() || "").includes(
        searchTermLower
      );
    } else if (searchColumn === "status") {
      return removeAccents(
        getStatusLabel(niche.status ?? "").label.toLowerCase()
      ).includes(searchTermLower);
    } else if (searchColumn === "description") {
      return removeAccents(niche.description?.toLowerCase() || "").includes(
        searchTermLower
      );
    }
    return true;
  });

  const CenteredCell = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  });

  const columns: GridColDef[] = [
    {
      field: "nicheCode",
      headerName: "Mã ô chứa",
      width: 200,
      headerClassName: "super-app-theme--header",

      renderCell: (params) => <CenteredCell>{params.value}</CenteredCell>,
    },
    {
      field: "customerName",
      headerName: "Tên khách hàng",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "deceasedName",
      headerName: "Tên người đã mất",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    // {
    //   field: "description",
    //   headerName: "Mô tả",
    //   width: 230,
    //   headerClassName: "super-app-theme--header",
    //   renderCell: (params) => {
    //     return (
    //       <CenteredCell>
    //         <Tooltip title={params.value as string}>
    //           <Box
    //             sx={{
    //               maxWidth: 200,
    //               overflow: "hidden",
    //               textOverflow: "ellipsis",
    //               whiteSpace: "nowrap",
    //             }}
    //           >
    //             {params.value}
    //           </Box>
    //         </Tooltip>
    //       </CenteredCell>
    //     );
    //   },
    // },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const { label, color } = getStatusLabel(params.value);
        return (
          <CenteredCell>
            <Chip
              label={label}
              color={
                color as
                  | "info"
                  | "error"
                  | "primary"
                  | "secondary"
                  | "success"
                  | "warning"
                  | "default"
              }
            />
          </CenteredCell>
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 160,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <CenteredCell>
          <Tooltip title="Xem chi tiết">
            <IconButton
              color="info"
              onClick={() => handleViewNiche(params.row.nicheId)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              color="secondary"
              onClick={() => handleEditNiche(params.row.nicheId)}
              disabled={
                params.row.status === "Booked" || params.row.status === "Active"
              }
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </CenteredCell>
      ),
    },
  ];

  const rows = filteredNiches.map((niche, index) => ({
    id: index + 1,
    ...niche,
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "& .super-app-theme--header": {
          backgroundColor: "rgba(176, 178, 181)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        style={{ width: "100%", maxWidth: 1200 }}
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <FormControl
            margin="normal"
            size="small"
            style={{ marginRight: 8, width: 110 }}
          >
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

          <FormControl
            margin="normal"
            size="small"
            style={{ marginRight: 8, width: 110 }}
          >
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

          <FormControl
            margin="normal"
            size="small"
            style={{ marginRight: 8, width: 110 }}
          >
            <InputLabel id="area-select-label">Khu</InputLabel>
            <Select
              label="Khu"
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

        <Box display="flex" alignItems="center">
          <FormControl variant="outlined" size="small" sx={{ marginRight: 2 }}>
            <InputLabel>Tìm theo</InputLabel>
            <Select
              value={searchColumn}
              onChange={handleSearchColumnChange}
              label="Tìm theo"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="nicheCode">Mã ô chứa</MenuItem>
              <MenuItem value="customerName">Tên khách hàng</MenuItem>
              <MenuItem value="deceasedName">Tên người đã mất</MenuItem>
              <MenuItem value="status">Trạng thái</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Paper
          elevation={3}
          style={{ padding: 4, width: "100%", maxWidth: 1200 }}
        >
          <CenteredTable
            rows={rows}
            columns={columns}
            autoHeight
            localeText={viVN}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
          />
        </Paper>
      </Box>
      <ViewNicheDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        nicheId={selectedNicheId}
      />
      <EditNicheDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          handleEditSuccess();
        }}
        nicheId={selectedNicheId}
        onSuccess={() => {}}
      />
    </Box>
  );
};

export default NicheList;
