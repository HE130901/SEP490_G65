
const viVN = {
    components: {
      MuiDataGrid: {
        defaultProps: {
          localeText: {
            // Define Vietnamese translations for DataGrid components
            noRowsLabel: 'Không có hàng nào',
            noResultsOverlayLabel: 'Không có kết quả nào',
            errorOverlayDefaultLabel: 'Đã xảy ra lỗi.',
            // Pagination
            paginationLabelRowsPerPage: 'Số hàng trên mỗi trang:',
            paginationLabelDisplayedRows: ({ from, to, count }: { from: number, to: number, count: number }) =>
              `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`,
            paginationLabelPage: 'Trang:',
            // Footer
            footerTotalVisibleRows: (visibleCount: any, totalCount: any) =>
              `${visibleCount} trên ${totalCount}`,
            // Columns panel text
            columnsPanelText: 'Chọn cột',
            columnsPanelHideAllButton: 'Ẩn tất cả',
            columnsPanelShowAllButton: 'Hiển thị tất cả',
            columnsPanelAddColumnButton: 'Thêm cột',
            // Filters panel text
            filterPanelAddFilterButton: 'Thêm bộ lọc',
            filterPanelRemoveAllButton: 'Xóa tất cả',
            filterPanelDeleteIconLabel: 'Xóa',
            filterPanelOperators: 'Toán tử',
            filterPanelOperatorAnd: 'Và',
            filterPanelOperatorOr: 'Hoặc',
            filterPanelColumns: 'Cột',
            filterPanelInputLabel: 'Giá trị',
            filterPanelInputPlaceholder: 'Lọc giá trị',
            // Filter operators text
            filterOperatorContains: 'Chứa',
            filterOperatorEquals: 'Bằng',
            filterOperatorStartsWith: 'Bắt đầu bằng',
            filterOperatorEndsWith: 'Kết thúc bằng',
            filterOperatorIsEmpty: 'Rỗng',
            filterOperatorIsNotEmpty: 'Không rỗng',
            filterOperatorIsAnyOf: 'Bất kỳ trong số',
            // Column menu text
            columnMenuLabel: 'Menu',
            columnMenuShowColumns: 'Hiển thị cột',
            columnMenuFilter: 'Bộ lọc',
            columnMenuHideColumn: 'Ẩn',
            columnMenuUnsort: 'Bỏ sắp xếp',
            columnMenuSortAsc: 'Sắp xếp tăng dần',
            columnMenuSortDesc: 'Sắp xếp giảm dần',
            // Column header text
            columnHeaderFiltersTooltipActive: (count: any) =>
              `${count} bộ lọc hoạt động`,
            columnHeaderFiltersLabel: 'Hiển thị bộ lọc',
            columnHeaderSortIconLabel: 'Sắp xếp',
            // Rows selected footer text
            footerRowSelected: (count: { toLocaleString: () => any; }) =>
              ``,
            // Checkbox selection text
            checkboxSelectionHeaderName: 'Chọn hàng',
            checkboxSelectionSelectAllRows: 'Chọn tất cả hàng',
            checkboxSelectionUnselectAllRows: 'Bỏ chọn tất cả hàng',
            checkboxSelectionSelectRow: 'Chọn hàng',
            checkboxSelectionUnselectRow: 'Bỏ chọn hàng',
          },
        },
      },
    },
  };
  
  export default viVN;
  