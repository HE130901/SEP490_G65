import React, { useState, useEffect, useRef, ChangeEvent } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import {
  FormData,
  Building,
  AddContractFormProps,
  ContractDocumentProps,
  SearchDialogProps,
} from "./interfaces";

import "./styles.css";

const initialFormData: FormData = {
  customerName: "",
  relationship: "",
  phone: "",
  address: "",
  idNumber: "",
  idDate: "",
  idPlace: "",
  deceasedName: "",
  age: "",
  deathDate: "",
  deathCertificate: "",
  deathCertificatePlace: "",
  nicheBuilding: "",
  nicheFloor: "",
  nicheZone: "",
  nicheCode: "",
  type: "",
  duration: 0,
  startDate: "",
  endDate: "",
  cost: 0,
  status: "Còn hiệu lực",
};

const buildings: Building[] = [
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
              { id: "N001", name: "Ô N001" },
              { id: "N002", name: "Ô N002" },
            ],
          },
        ],
      },
    ],
  },
];

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
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [searchOpen, setSearchOpen] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contractRef.current,
  });

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const endDate = calculateEndDate(
        formData.startDate,
        formData.type,
        formData.duration
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        endDate: endDate,
      }));
    }
  }, [formData.startDate, formData.type, formData.duration]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name as string]: value,
      cost: calculateCost(formData.type, formData.duration),
    });
  };

  const handleImport = (importedData: Partial<FormData>) => {
    setFormData({ ...formData, ...importedData });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newContract = {
      ...formData,
      id: 0,
      code: "",
    };
    handleSave(newContract);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name as string]: value,
      duration: 0,
      cost: 0,
    }));
  };

  const handleDurationChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name as string]: value,
      cost: calculateCost(prevFormData.type, parseInt(value as string, 10)),
    }));
  };

  const selectedBuilding = buildings.find(
    (building) => building.id === parseInt(formData.nicheBuilding, 10)
  );

  const selectedFloor = selectedBuilding?.floors.find(
    (floor) => floor.id === parseInt(formData.nicheFloor, 10)
  );

  const selectedZone = selectedFloor?.zones.find(
    (zone) => zone.id === parseInt(formData.nicheZone, 10)
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          Thêm mới hợp đồng
          <Button
            onClick={handleSearchOpen}
            color="primary"
            className="searchButton"
          >
            <SearchIcon />
            Nhập từ mã đơn đăng ký
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Tên khách hàng"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Quan hệ với người chết</InputLabel>
                  <Select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleTypeChange}
                    label="Quan hệ với người chết"
                  >
                    <MenuItem value="Cha/Mẹ">Cha/Mẹ</MenuItem>
                    <MenuItem value="Anh/Chị/Em">Anh/Chị/Em</MenuItem>
                    <MenuItem value="Con">Con</MenuItem>
                    <MenuItem value="Khác">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Số CCCD"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Ngày cấp CCCD"
                  name="idDate"
                  type="date"
                  value={formData.idDate}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nơi cấp CCCD"
                  name="idPlace"
                  value={formData.idPlace}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom mt={4}>
              Thông tin người chết
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Họ tên người chết"
                  name="deceasedName"
                  value={formData.deceasedName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Tuổi"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Ngày chết"
                  name="deathDate"
                  type="date"
                  value={formData.deathDate}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Giấy chứng tử số"
                  name="deathCertificate"
                  value={formData.deathCertificate}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nơi cấp giấy chứng tử"
                  name="deathCertificatePlace"
                  value={formData.deathCertificatePlace}
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
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Nhà</InputLabel>
                  <Select
                    name="nicheBuilding"
                    value={formData.nicheBuilding}
                    onChange={handleTypeChange}
                    label="Nhà"
                  >
                    {buildings.map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Tầng</InputLabel>
                  <Select
                    name="nicheFloor"
                    value={formData.nicheFloor}
                    onChange={handleTypeChange}
                    label="Tầng"
                  >
                    {selectedBuilding &&
                      selectedBuilding.floors.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id}>
                          {floor.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Khu</InputLabel>
                  <Select
                    name="nicheZone"
                    value={formData.nicheZone}
                    onChange={handleTypeChange}
                    label="Khu"
                  >
                    {selectedFloor &&
                      selectedFloor.zones.map((zone) => (
                        <MenuItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Ô</InputLabel>
                  <Select
                    name="nicheCode"
                    value={formData.nicheCode}
                    onChange={handleTypeChange}
                    label="Ô"
                  >
                    {selectedZone &&
                      selectedZone.niches.map((niche) => (
                        <MenuItem key={niche.id} value={niche.id}>
                          {niche.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Loại hình gửi</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleTypeChange}
                    label="Loại hình gửi"
                  >
                    <MenuItem value="Gửi theo tháng">Gửi theo tháng</MenuItem>
                    <MenuItem value="Gửi theo năm">Gửi theo năm</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.type === "Gửi theo tháng" && (
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Số tháng"
                    name="duration"
                    type="number"
                    inputProps={{ min: 1, max: 12 }}
                    value={formData.duration}
                    onChange={handleDurationChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              )}
              {formData.type === "Gửi theo năm" && (
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Số năm"
                    name="duration"
                    type="number"
                    inputProps={{ min: 1, max: 10 }}
                    value={formData.duration}
                    onChange={handleDurationChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Chi phí"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
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
          <Button
            onClick={handlePrint}
            variant="contained"
            startIcon={<PrintIcon />}
            className="printButton"
          >
            In hợp đồng
          </Button>
        </DialogActions>
      </Dialog>
      <SearchDialog
        open={searchOpen}
        handleClose={handleSearchClose}
        handleImport={handleImport}
      />
      <div style={{ display: "none" }}>
        <ContractDocument ref={contractRef} formData={formData} />
      </div>
    </>
  );
};

const SearchDialog: React.FC<SearchDialogProps> = ({
  open,
  handleClose,
  handleImport,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // Logic tìm kiếm mã đơn đăng ký
    const importedData: Partial<FormData> = {
      customerName: "Nguyễn Văn A",
      phone: "0123456789",
      nicheBuilding: "Tòa nhà A",
      nicheFloor: "Tầng 1",
      nicheZone: "Khu 1",
      nicheCode: "N001",
    };
    handleImport(importedData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Tìm kiếm mã đơn đăng ký</DialogTitle>
      <DialogContent>
        <TextField
          label="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        {/* Giả lập kết quả tìm kiếm */}
        <Box mt={2}>
          <Typography>Kết quả tìm kiếm:</Typography>
          <Button onClick={handleSearch} color="primary">
            Chọn mã đơn đăng ký
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ContractDocument = React.forwardRef<
  HTMLDivElement,
  ContractDocumentProps
>(({ formData }, ref) => (
  <div ref={ref} style={{ padding: "20px" }}>
    <Typography variant="h4" align="center" gutterBottom>
      HỢP ĐỒNG GỬI GIỮ TRO CỐT
    </Typography>
    <Typography variant="h6" align="center" gutterBottom>
      Số: [Số hợp đồng]
    </Typography>
    <Typography variant="h6" align="center" gutterBottom>
      Ngày tháng: {formData.startDate}
    </Typography>

    <Typography variant="h6" gutterBottom>
      BÊN A: Công ty An Bình Viên
    </Typography>
    <Typography>Địa chỉ: [Địa chỉ của công ty]</Typography>
    <Typography>Điện thoại: [Số điện thoại công ty]</Typography>
    <Typography>Đại diện bởi: [Tên người đại diện]</Typography>
    <Typography>Chức vụ: [Chức vụ người đại diện]</Typography>

    <Typography variant="h6" gutterBottom mt={4}>
      BÊN B: {formData.customerName}
    </Typography>
    <Typography>Địa chỉ: {formData.address}</Typography>
    <Typography>Số điện thoại: {formData.phone}</Typography>
    <Typography>CMND/CCCD: {formData.idNumber}</Typography>
    <Typography>Ngày cấp: {formData.idDate}</Typography>
    <Typography>Nơi cấp: {formData.idPlace}</Typography>

    <Typography variant="h6" gutterBottom mt={4}>
      ĐIỀU 1: MỤC ĐÍCH VÀ PHẠM VI HỢP ĐỒNG
    </Typography>
    <Typography>
      Hợp đồng này nhằm mục đích quy định việc gửi giữ tro cốt của{" "}
      {formData.deceasedName} giữa Bên A và Bên B.
    </Typography>

    <Typography variant="h6" gutterBottom mt={4}>
      ĐIỀU 2: THỜI HẠN GỬI GIỮ
    </Typography>
    <Typography>
      Thời hạn gửi giữ tro cốt là {formData.duration}{" "}
      {formData.type === "Gửi theo tháng" ? "tháng" : "năm"}, kể từ ngày{" "}
      {formData.startDate} đến ngày {formData.endDate}.
    </Typography>

    <Typography variant="h6" gutterBottom mt={4}>
      ĐIỀU 3: DỊCH VỤ VÀ CHI PHÍ
    </Typography>
    <Typography>
      3.1. Bên A sẽ cung cấp dịch vụ gửi giữ tro cốt tại [địa điểm gửi giữ] với
      các điều kiện và dịch vụ sau:
    </Typography>
    <Typography>[Mô tả chi tiết dịch vụ và các điều kiện]</Typography>
    <Typography>
      3.2. Chi phí dịch vụ là {formData.cost.toLocaleString()} VND, được thanh
      toán theo định kỳ [khoảng thời gian thanh toán].
    </Typography>

    <Typography variant="h6" gutterBottom mt={4}>
      ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
    </Typography>
    <Typography>4.1. Bên A có trách nhiệm:</Typography>
    <Typography>Bảo quản tro cốt theo đúng cam kết.</Typography>
    <Typography>
      Thông báo cho Bên B về bất kỳ thay đổi liên quan đến dịch vụ gửi giữ.
    </Typography>
    <Typography>4.2. Bên B có trách nhiệm:</Typography>
    <Typography>
      Cung cấp đầy đủ thông tin và giấy tờ liên quan đến việc gửi giữ tro cốt.
    </Typography>
    <Typography>
      Thanh toán đầy đủ và đúng hạn các khoản phí đã thỏa thuận.
    </Typography>

    <Typography variant="h6" gutterBottom mt={4}>
      ĐIỀU 5: ĐIỀU KHOẢN CHUNG
    </Typography>
    <Typography>
      Các điều khoản và điều kiện khác của hợp đồng sẽ được thực hiện theo pháp
      luật hiện hành của Việt Nam. Mọi tranh chấp phát sinh từ hợp đồng này sẽ
      được giải quyết thông qua thương lượng và hòa giải. Trong trường hợp không
      giải quyết được, các bên có quyền khởi kiện tại Tòa án có thẩm quyền.
    </Typography>

    <Typography variant="h6" gutterBottom mt={4}>
      ĐIỀU 6: KÝ KẾT HỢP ĐỒNG
    </Typography>
    <Typography>
      Hợp đồng này được lập thành hai bản có giá trị pháp lý như nhau, mỗi bên
      giữ một bản và có hiệu lực kể từ ngày ký.
    </Typography>

    <Box mt={4}>
      <Grid container>
        <Grid item xs={6}>
          <Typography>Đại diện Bên A</Typography>
          <Typography>[Tên người ký]</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Đại diện Bên B</Typography>
          <Typography>{formData.customerName}</Typography>
        </Grid>
      </Grid>
    </Box>
  </div>
));

ContractDocument.displayName = "ContractDocument";

export default AddContractForm;
