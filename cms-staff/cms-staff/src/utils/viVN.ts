import { GridLocaleText } from '@mui/x-data-grid';

export const viVN: GridLocaleText = {
  // Root
  noRowsLabel: 'Không có hàng nào',
  noResultsOverlayLabel: 'Không có kết quả nào',

  // Density selector toolbar button text
  toolbarDensity: 'Mật độ',
  toolbarDensityLabel: 'Mật độ',
  toolbarDensityCompact: 'Gọn',
  toolbarDensityStandard: 'Tiêu chuẩn',
  toolbarDensityComfortable: 'Thoải mái',

  // Columns selector toolbar button text
  toolbarColumns: 'Cột',
  toolbarColumnsLabel: 'Chọn cột',

  // Filters toolbar button text
  toolbarFilters: 'Bộ lọc',
  toolbarFiltersLabel: 'Hiển thị bộ lọc',
  toolbarFiltersTooltipHide: 'Ẩn bộ lọc',
  toolbarFiltersTooltipShow: 'Hiển thị bộ lọc',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} bộ lọc đang hoạt động` : `${count} bộ lọc đang hoạt động`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Tìm kiếm…',
  toolbarQuickFilterLabel: 'Tìm kiếm',
  toolbarQuickFilterDeleteIconLabel: 'Xóa',

  // Export selector toolbar button text
  toolbarExport: 'Xuất',
  toolbarExportLabel: 'Xuất',
  toolbarExportCSV: 'Tải xuống CSV',
  toolbarExportPrint: 'In',
  toolbarExportExcel: 'Tải xuống Excel',

  // Columns management text
  columnsManagementSearchTitle: 'Tìm kiếm',
  columnsManagementNoColumns: 'Không có cột nào',
  columnsManagementShowHideAllText: 'Hiển thị/Ẩn tất cả',
  columnsManagementReset: 'Đặt lại',

  // Filter panel text
  filterPanelAddFilter: 'Thêm bộ lọc',
  filterPanelRemoveAll: 'Xóa tất cả',
  filterPanelDeleteIconLabel: 'Xóa',
  filterPanelLogicOperator: 'Toán tử logic',
  filterPanelOperator: 'Toán tử',
  filterPanelOperatorAnd: 'Và',
  filterPanelOperatorOr: 'Hoặc',
  filterPanelColumns: 'Cột',
  filterPanelInputLabel: 'Giá trị',
  filterPanelInputPlaceholder: 'Giá trị bộ lọc',

  // Filter operators text
  filterOperatorContains: 'chứa',
  filterOperatorEquals: 'bằng',
  filterOperatorStartsWith: 'bắt đầu với',
  filterOperatorEndsWith: 'kết thúc với',
  filterOperatorIs: 'là',
  filterOperatorNot: 'không là',
  filterOperatorAfter: 'sau',
  filterOperatorOnOrAfter: 'trên hoặc sau',
  filterOperatorBefore: 'trước',
  filterOperatorOnOrBefore: 'trên hoặc trước',
  filterOperatorIsEmpty: 'rỗng',
  filterOperatorIsNotEmpty: 'không rỗng',
  filterOperatorIsAnyOf: 'là bất kỳ của',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Chứa',
  headerFilterOperatorEquals: 'Bằng',
  headerFilterOperatorStartsWith: 'Bắt đầu với',
  headerFilterOperatorEndsWith: 'Kết thúc với',
  headerFilterOperatorIs: 'Là',
  headerFilterOperatorNot: 'Không là',
  headerFilterOperatorAfter: 'Sau',
  headerFilterOperatorOnOrAfter: 'Trên hoặc sau',
  headerFilterOperatorBefore: 'Trước',
  headerFilterOperatorOnOrBefore: 'Trên hoặc trước',
  headerFilterOperatorIsEmpty: 'Rỗng',
  headerFilterOperatorIsNotEmpty: 'Không rỗng',
  headerFilterOperatorIsAnyOf: 'Là bất kỳ của',
  'headerFilterOperator=': 'Bằng',
  'headerFilterOperator!=': 'Không bằng',
  'headerFilterOperator>': 'Lớn hơn',
  'headerFilterOperator>=': 'Lớn hơn hoặc bằng',
  'headerFilterOperator<': 'Nhỏ hơn',
  'headerFilterOperator<=': 'Nhỏ hơn hoặc bằng',

  // Filter values text
  filterValueAny: 'bất kỳ',
  filterValueTrue: 'đúng',
  filterValueFalse: 'sai',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Hiển thị cột',
  columnMenuManageColumns: 'Quản lý cột',
  columnMenuFilter: 'Bộ lọc',
  columnMenuHideColumn: 'Ẩn cột',
  columnMenuUnsort: 'Bỏ sắp xếp',
  columnMenuSortAsc: 'Sắp xếp tăng dần',
  columnMenuSortDesc: 'Sắp xếp giảm dần',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} bộ lọc đang hoạt động` : `${count} bộ lọc đang hoạt động`,
  columnHeaderFiltersLabel: 'Hiển thị bộ lọc',
  columnHeaderSortIconLabel: 'Sắp xếp',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? ` `
      : ` `,

  // Total row amount footer text
  footerTotalRows: 'Tổng số hàng:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} của ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Chọn checkbox',
  checkboxSelectionSelectAllRows: 'Chọn tất cả hàng',
  checkboxSelectionUnselectAllRows: 'Bỏ chọn tất cả hàng',
  checkboxSelectionSelectRow: 'Chọn hàng',
  checkboxSelectionUnselectRow: 'Bỏ chọn hàng',

  // Boolean cell text
  booleanCellTrueLabel: 'đúng',
  booleanCellFalseLabel: 'sai',

  // Actions cell more text
  actionsCellMore: 'thêm',

  // Column pinning text
  pinToLeft: 'Ghim sang trái',
  pinToRight: 'Ghim sang phải',
  unpin: 'Bỏ ghim',

  // Tree Data
  treeDataGroupingHeaderName: 'Nhóm',
  treeDataExpand: 'xem các mục con',
  treeDataCollapse: 'ẩn các mục con',

  // Grouping columns
  groupingColumnHeaderName: 'Nhóm',
  groupColumn: (name) => `Nhóm theo ${name}`,
  unGroupColumn: (name) => `Bỏ nhóm theo ${name}`,

  // Master/detail
  detailPanelToggle: 'Chuyển đổi bảng điều khiển chi tiết',
  expandDetailPanel: 'Mở rộng',
  collapseDetailPanel: 'Thu gọn',

  // Used core components translation keys
  MuiTablePagination: {
    labelRowsPerPage: 'Số hàng trên mỗi trang:',
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`,
  },

  // Row reordering text
  rowReorderingHeaderName: 'Sắp xếp lại hàng',

  // Aggregation
  aggregationMenuItemHeader: 'Tổng hợp',
  aggregationFunctionLabelSum: 'tổng',
  aggregationFunctionLabelAvg: 'trung bình',
  aggregationFunctionLabelMin: 'nhỏ nhất',
  aggregationFunctionLabelMax: 'lớn nhất',
  aggregationFunctionLabelSize: 'kích thước',
};
