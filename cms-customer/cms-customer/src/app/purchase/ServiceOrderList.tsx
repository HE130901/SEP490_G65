"use client";

import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Eye, Edit, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDateDialog from "./EditDateDialog";
import DetailViewDialog from "./DetailViewDialog";
import debounce from "lodash.debounce";
import { remove as removeDiacritics } from "diacritics";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";

export type ServiceOrderDetail = {
  serviceName: string;
  quantity: number;
  status: string;
  price: number;
  completionImage?: string;
};

export type ServiceOrder = {
  serviceOrderId: number;
  nicheAddress: string;
  createdDate: string;
  deceasedName: string;
  orderDate: string;
  serviceOrderCode: string;
  serviceOrderDetails: {
    $values: ServiceOrderDetail[];
  };
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Pending":
      return "red";
    case "Canceled":
      return "destructive";
    case "Completed":
      return "green";
    default:
      return "default";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "Completed":
      return "Đã hoàn thành";
    case "Pending":
      return "Đang chờ";
    case "Canceled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

const columnHelper = createColumnHelper<ServiceOrder>();

export default function ServiceOrderList({
  reFetchTrigger,
}: {
  reFetchTrigger: boolean;
}) {
  const { setOrders, fetchOrders, orders, user } = useStateContext();
  const [editingRecord, setEditingRecord] = useState<ServiceOrder | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ServiceOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(orders);
  const [searchField, setSearchField] = useState("all");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders, reFetchTrigger]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = orders.filter((item: any) =>
      Object.keys(item).some((key) =>
        String(item[key as keyof ServiceOrder])
          .toLowerCase()
          .includes(lowercasedFilter)
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, orders]);

  const handleEdit = (record: ServiceOrder) => {
    const hasPendingStatus = record.serviceOrderDetails.$values.some(
      (detail) => detail.status === "Pending"
    );
    if (hasPendingStatus) {
      setEditingRecord(record);
    } else {
      toast.warning(
        "Chỉ có thể chỉnh sửa đơn đặt hàng có trạng thái 'Pending'."
      );
    }
  };

  const handleView = (record: ServiceOrder) => {
    setViewingRecord(record);
  };

  const handleSave = async (updatedRecord: ServiceOrder) => {
    setEditingRecord(null);
    fetchOrders();
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("serviceOrderCode", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mã đơn hàng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("nicheAddress", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Địa chỉ ô chứa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("deceasedName", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên người mất
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => <div className="text-left">{info.getValue()}</div>,
      }),

      columnHelper.accessor("createdDate", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
      }),
      columnHelper.accessor("orderDate", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ngày hẹn
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
      }),

      columnHelper.accessor("serviceOrderDetails.$values", {
        header: "Dịch vụ/Sản phẩm",
        cell: (info) => (
          <div className="text-left">
            {info.getValue().map((detail, i) => (
              <div key={i} style={{ marginBottom: "4px" }}>
                {detail.serviceName} x {detail.quantity}
              </div>
            ))}
          </div>
        ),
      }),

      columnHelper.accessor("serviceOrderDetails.$values", {
        header: "Trạng thái",
        cell: (info) => (
          <>
            {info.getValue().map((detail, i) => (
              <div key={i} style={{ marginBottom: "4px" }}>
                <Badge variant={getStatusVariant(detail.status)}>
                  {getStatusText(detail.status)}
                </Badge>
              </div>
            ))}
          </>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Hành động",
        cell: (props) => (
          <div className="flex justify-center items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    color="info"
                    onClick={() => handleView(props.row.original)}
                  >
                    <Eye className="w-4 h-4" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>Xem chi tiết</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
      }),
    ],
    [handleEdit, handleView]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChange = (value: string) => {
    setSearchField(value);
  };
  const getSearchFieldLabel = (value: string) => {
    switch (value) {
      case "all":
        return "Tất cả";
      case "serviceOrderCode":
        return "Mã đơn";
      case "nicheAddress":
        return "Địa chỉ Ô";
      case "createdDate":
        return "Ngày tạo";
      case "orderDate":
        return "Ngày hẹn";
      case "status":
        return "Trạng thái";
      default:
        return "Tất cả";
    }
  };

  const normalizeText = (text: string) => {
    return removeDiacritics(text.toLowerCase());
  };
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const normalizedTerm = normalizeText(term);
      const filtered = orders.filter((order: ServiceOrder) => {
        if (searchField === "all") {
          return (
            normalizeText(order.deceasedName).includes(normalizedTerm) ||
            normalizeText(order.serviceOrderCode).includes(normalizedTerm) ||
            normalizeText(order.nicheAddress).includes(normalizedTerm) ||
            normalizeText(order.createdDate).includes(normalizedTerm) ||
            normalizeText(order.orderDate).includes(normalizedTerm) ||
            order.serviceOrderDetails.$values.some((detail) =>
              normalizeText(detail.serviceName).includes(normalizedTerm)
            ) ||
            order.serviceOrderDetails.$values.some((detail) =>
              normalizeText(detail.status).includes(normalizedTerm)
            )
          );
        } else {
          return normalizeText(
            String(order[searchField as keyof ServiceOrder])
          ).includes(normalizedTerm);
        }
      });
      setFilteredData(filtered);
    }, 300),
    [orders, searchField]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold text-center">
          Danh sách đơn đặt hàng
        </h2>
        <div className="flex items-center ml-auto space-x-4">
          <div className="w-36">
            <Select value={searchField} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <span>{getSearchFieldLabel(searchField)}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="serviceOrderCode">Mã đơn</SelectItem>
                <SelectItem value="nicheAddress">Địa chỉ Ô</SelectItem>
                <SelectItem value="createdDate">Ngày tạo</SelectItem>
                <SelectItem value="orderDate">Ngày hẹn</SelectItem>
                <SelectItem value="status">Trạng thái</SelectItem>
                <SelectItem value="deceasedName">Tên người mất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-64">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-4"
            />
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-center bg-gray-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="text-center">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Bạn chưa có đơn đặt hàng.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Tổng số lượng đơn đặt hàng: {table.getFilteredRowModel().rows.length}{" "}
          đơn
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Editing Modal */}
      {editingRecord && (
        <EditDateDialog
          record={editingRecord}
          onSave={handleSave}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* Detail View Modal */}
      {viewingRecord && (
        <DetailViewDialog
          record={viewingRecord}
          onClose={() => setViewingRecord(null)}
          onSave={(record: ServiceOrder) => handleSave(record)}
        />
      )}
    </div>
  );
}
