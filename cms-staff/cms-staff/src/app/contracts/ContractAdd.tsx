import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  FormData,
  Building,
  AddContractFormProps,
  Contract,
  Floor,
  Area,
  Niche,
} from "./interfaces";
import contractService from "@/services/contractService";
import "./styles.css";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook

const initialFormData: FormData = {
  customerFullName: "",
  customerPhoneNumber: "",
  customerEmail: "",
  customerAddress: "",
  customerCitizenId: "",
  customerCitizenIdIssueDate: "",
  customerCitizenIdSupplier: "",
  deceasedFullName: "",
  deceasedCitizenId: "",
  deceasedDateOfBirth: "",
  deceasedDateOfDeath: "",
  deathCertificateNumber: "",
  deathCertificateSupplier: "",
  relationshipWithCustomer: "",
  nicheID: 0,
  staffID: 0,
  startDate: "",
  endDate: "",
  note: "",
  totalAmount: 0,
};

const calculateCost = (type: string, duration: number): number => {
  if (type === "Gửi theo tháng") {
    return duration * 200000;
  } else if (type === "Gửi theo năm") {
    if (duration <= 2) return 2000000;
    if (duration <= 5) return 3500000;
    if (duration <= 9) return 5000000;
    return 7000000;
  }
  return 0;
};

const calculateEndDate = (
  startDate: string,
  type: string,
  duration: number
): string => {
  if (!startDate) return "";
  const date = new Date(startDate);
  if (type === "Gửi theo tháng") {
    date.setMonth(date.getMonth() + duration);
  } else if (type === "Gửi theo năm") {
    date.setFullYear(date.getFullYear() + duration);
  }
  return date.toISOString().split("T")[0];
};

const AddContractForm: React.FC<AddContractFormProps> = ({
  open,
  handleClose,
  handleSave,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [type, setType] = useState<string>("Gửi theo tháng");
  const [duration, setDuration] = useState<number>(1);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const buildingsData = await contractService.getBuildings();
        setBuildings(buildingsData.$values || []);
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (formData.startDate) {
      const endDate = calculateEndDate(formData.startDate, type, duration);
      setFormData((prevFormData) => ({
        ...prevFormData,
        endDate: endDate,
        totalAmount: calculateCost(type, duration),
      }));
    }
  }, [formData.startDate, type, duration]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBuildingChange = async (event: SelectChangeEvent<string>) => {
    const buildingId = parseInt(event.target.value);
    setSelectedBuilding(buildingId);
    setSelectedFloor(null);
    setSelectedArea(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      nicheID: 0,
    }));
    try {
      const floorsData = await contractService.getFloors(buildingId);
      setFloors(floorsData.$values || []);
      setAreas([]);
      setNiches([]);
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  const handleFloorChange = async (event: SelectChangeEvent<string>) => {
    const floorId = parseInt(event.target.value);
    setSelectedFloor(floorId);
    setSelectedArea(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      nicheID: 0,
    }));
    try {
      const areasData = await contractService.getAreas(
        selectedBuilding!,
        floorId
      );
      setAreas(areasData.$values || []);
      setNiches([]);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleAreaChange = async (event: SelectChangeEvent<string>) => {
    const areaId = parseInt(event.target.value);
    setSelectedArea(areaId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      nicheID: 0,
    }));
    try {
      const nichesData = await contractService.getNiches(
        selectedBuilding!,
        selectedFloor!,
        areaId
      );
      setNiches(nichesData.$values || []);
    } catch (error) {
      console.error("Error fetching niches:", error);
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setType(value);
    setDuration(1); // Reset duration when type changes
  };

  const handleDurationChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setDuration(parseInt(value, 10));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !user.id) {
      console.error("User not logged in");
      return;
    }
    const contractData: Omit<Contract, "id" | "code" | "status"> = {
      ...formData,
      staffID: user.id,
      nicheAddress: "",
      contractId: 0,
      niche: "",
      customer: "",
      nicheCode: "",
      customerName: formData.customerFullName,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };
    try {
      await contractService.createContract(contractData);
      handleSave(contractData);
    } catch (error) {
      console.error("Error creating contract:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Thêm mới hợp đồng</DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Thông tin khách hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên khách hàng"
                name="customerFullName"
                value={formData.customerFullName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                name="customerPhoneNumber"
                value={formData.customerPhoneNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Địa chỉ"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số CCCD"
                name="customerCitizenId"
                value={formData.customerCitizenId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày cấp CCCD"
                name="customerCitizenIdIssueDate"
                type="date"
                value={formData.customerCitizenIdIssueDate}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nơi cấp CCCD"
                name="customerCitizenIdSupplier"
                value={formData.customerCitizenIdSupplier}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom mt={4}>
            Thông tin người đã mất
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ tên người đã mất"
                name="deceasedFullName"
                value={formData.deceasedFullName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Quan hệ với khách hàng</InputLabel>
                <Select
                  name="relationshipWithCustomer"
                  value={formData.relationshipWithCustomer}
                  onChange={handleSelectChange}
                  label="Quan hệ với khách hàng"
                >
                  <MenuItem value="Ông/Bà">Ông/Bà</MenuItem>
                  <MenuItem value="Cha/Mẹ">Cha/Mẹ</MenuItem>
                  <MenuItem value="Anh/Chị/Em">Anh/Chị/Em</MenuItem>
                  <MenuItem value="Con">Con</MenuItem>
                  <MenuItem value="Con">Cháu</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số CCCD người đã mất"
                name="deceasedCitizenId"
                value={formData.deceasedCitizenId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày sinh"
                name="deceasedDateOfBirth"
                type="date"
                value={formData.deceasedDateOfBirth}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày mất"
                name="deceasedDateOfDeath"
                type="date"
                value={formData.deceasedDateOfDeath}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giấy chứng tử số"
                name="deathCertificateNumber"
                value={formData.deathCertificateNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nơi cấp giấy chứng tử"
                name="deathCertificateSupplier"
                value={formData.deathCertificateSupplier}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom mt={4}>
            Thông tin hợp đồng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Nhà</InputLabel>
                <Select
                  name="building"
                  value={selectedBuilding?.toString() || ""}
                  onChange={handleBuildingChange}
                  label="Nhà"
                >
                  {buildings.map((building) => (
                    <MenuItem
                      key={building.buildingId}
                      value={building.buildingId}
                    >
                      {building.buildingName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tầng</InputLabel>
                <Select
                  name="floor"
                  value={selectedFloor?.toString() || ""}
                  onChange={handleFloorChange}
                  label="Tầng"
                  disabled={!selectedBuilding}
                >
                  {floors.map((floor) => (
                    <MenuItem key={floor.floorId} value={floor.floorId}>
                      {floor.floorName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Khu</InputLabel>
                <Select
                  name="area"
                  value={selectedArea?.toString() || ""}
                  onChange={handleAreaChange}
                  label="Khu"
                  disabled={!selectedFloor}
                >
                  {areas.map((area) => (
                    <MenuItem key={area.areaId} value={area.areaId}>
                      {area.areaName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Ô</InputLabel>
                <Select
                  name="nicheID"
                  value={formData.nicheID.toString()}
                  onChange={(e: SelectChangeEvent<string>) => {
                    const nicheId = parseInt(e.target.value);
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      nicheID: nicheId,
                    }));
                  }}
                  label="Ô"
                  disabled={!selectedArea}
                >
                  {niches.map((niche) => (
                    <MenuItem key={niche.nicheId} value={niche.nicheId}>
                      {niche.nicheName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Loại hình gửi</InputLabel>
                <Select
                  name="type"
                  value={type}
                  onChange={handleTypeChange}
                  label="Loại hình gửi"
                >
                  <MenuItem value="Gửi theo tháng">Gửi theo tháng</MenuItem>
                  <MenuItem value="Gửi theo năm">Gửi theo năm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {type === "Gửi theo tháng" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số tháng"
                  name="duration"
                  type="number"
                  inputProps={{ min: 1, max: 12 }}
                  value={duration}
                  onChange={handleDurationChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            )}
            {type === "Gửi theo năm" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số năm"
                  name="duration"
                  type="number"
                  inputProps={{ min: 1, max: 10 }}
                  value={duration}
                  onChange={handleDurationChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Thời hạn gửi từ ngày"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Đến ngày"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chi phí"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ghi chú"
                name="note"
                value={formData.note}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          startIcon={<CancelIcon />}
          className="cancelButton"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          className="saveButton"
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddContractForm;
