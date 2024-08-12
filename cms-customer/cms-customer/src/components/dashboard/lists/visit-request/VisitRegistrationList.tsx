"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStateContext } from "@/context/StateContext";
import VisitRegistrationAPI from "@/services/visitService";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Eye, Trash } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import DetailViewDialog from "./DetailViewDialog";
import EditModal from "./EditModal";

import { remove as removeDiacritics } from "diacritics";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { IconButton } from "@mui/material";

export type VisitRegistration = {
  visitId: number;
  customerId: number;
  nicheId: number;
  createdDate: string;
  visitDate: string;
  status: string;
  accompanyingPeople: number;
  note: string;
  visitCode: string;
  nicheAddress: string;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Pending":
      return "default";
    case "Canceled":

    case "Expired":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "Approved":
      return "Đã duyệt";
    case "Pending":
      return "Đang chờ duyệt";
    case "Canceled":
      return "Đã hủy";
    case "Expired":
      return "Đã hết hạn";
    default:
      return "Không xác định";
  }
};
export default function VisitRegistrationList({
  reFetchTrigger,
}: {
  reFetchTrigger: boolean;
}) {
  const {
    visitRegistrations,
    setVisitRegistrations,
    fetchVisitRegistrations,
    user,
  } = useStateContext();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(visitRegistrations);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [editingRecord, setEditingRecord] = useState<VisitRegistration | null>(
    null
  );
  const [deleteRecord, setDeleteRecord] = useState<VisitRegistration | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<VisitRegistration | null>(
    null
  );

  const [searchField, setSearchField] = useState("all");

  useEffect(() => {
    if (user && user.customerId) {
      fetchVisitRegistrations(user.customerId);
    }
  }, [user, fetchVisitRegistrations, reFetchTrigger]);

  const normalizeText = (text: string) => {
    return removeDiacritics(text.toLowerCase());
  };

  useEffect(() => {
    const lowercasedFilter = normalizeText(searchTerm);
    const filteredData = visitRegistrations.filter((item: any) =>
      Object.keys(item).some((key) =>
        normalizeText(String(item[key])).includes(lowercasedFilter)
      )
    );
    setFilteredData(filteredData);
  }, [searchTerm, visitRegistrations]);

  const handleEdit = (record: VisitRegistration) => {
    if (record.status === "Canceled") return;
    setEditingRecord(record);
    setViewingRecord(null);
    setDeleteRecord(null);
  };

  const handleDeleteConfirmation = (record: VisitRegistration) => {
    if (record.status === "Canceled") return;
    setDeleteRecord(record);
    setViewingRecord(null);
    setEditingRecord(null);
  };

  const handleView = (record: VisitRegistration) => {
    setViewingRecord(record);
    setEditingRecord(null);
    setDeleteRecord(null);
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;

    try {
      await VisitRegistrationAPI.delete(deleteRecord.visitId);
      toast.success("Đã hủy đơn đăng ký thành công!");
      setVisitRegistrations((prev: any[]) =>
        prev.map((registration: { visitId: number }) =>
          registration.visitId === deleteRecord.visitId
            ? { ...registration, status: "Canceled" }
            : registration
        )
      );
      setDeleteRecord(null);
    } catch (error) {
      console.error("Error canceling visit registration:", error);
      toast.error("Không thể hủy đơn đăng ký.");
    }
  };

  const handleSave = async (updatedRecord: VisitRegistration) => {
    try {
      if (!updatedRecord.visitId) {
        console.error("Invalid visitId:", updatedRecord.visitId);
        return;
      }
      const dataToUpdate = {
        visitDate: updatedRecord.visitDate,
        note: updatedRecord.note,
        accompanyingPeople: updatedRecord.accompanyingPeople,
      };
      await VisitRegistrationAPI.update(updatedRecord.visitId, dataToUpdate);
      toast.success("Cập nhật đơn đăng ký thành công!");
      setEditingRecord(null);
      fetchVisitRegistrations(user.customerId);
    } catch (error) {
      console.error("Error updating visit registration:", error);
      toast.error("Không thể cập nhật đơn đăng ký.");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const columns: ColumnDef<VisitRegistration>[] = [
    {
      id: "stt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "visitCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã đơn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("visitCode")}</div>
      ),
    },
    {
      accessorKey: "nicheAddress",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Địa chỉ ô chứa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("nicheAddress")}</div>
      ),
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày Tạo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {formatDate(row.getValue("createdDate"))}
        </div>
      ),
    },
    {
      accessorKey: "visitDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày Hẹn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {formatDate(row.getValue("visitDate"))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng Thái
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant={getStatusVariant(row.getValue("status"))}>
            {getStatusText(row.getValue("status")) || "Không có thông tin"}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Hành Động",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(row.original);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row.original);
                  }}
                  color="warning"
                  disabled={
                    row.original.status === "Canceled" ||
                    row.original.status === "Approved" ||
                    row.original.status === "Expired"
                  }
                >
                  <Edit className="w-4 h-4" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Chỉnh sửa</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConfirmation(row.original);
                  }}
                  color="error"
                  disabled={
                    row.original.status === "Canceled" ||
                    row.original.status === "Approved" ||
                    row.original.status === "Expired"
                  }
                >
                  <Trash className="w-4 h-4" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Hủy đơn</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
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
      case "reservationId":
        return "Mã đơn";
      case "nicheAddress":
        return "Địa chỉ Ô";
      case "createdDate":
        return "Ngày tạo";
      case "confirmationDate":
        return "Ngày hẹn";
      case "status":
        return "Trạng thái";
      default:
        return "Tất cả";
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold text-center">Đơn đăng ký viếng</h2>
        <div className="flex items-center ml-auto space-x-4">
          <div className="w-36">
            <Select value={searchField} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <span>{getSearchFieldLabel(searchField)}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="reservationId">Mã đơn</SelectItem>
                <SelectItem value="nicheAddress">Địa chỉ Ô</SelectItem>
                <SelectItem value="createdDate">Ngày tạo</SelectItem>
                <SelectItem value="confirmationDate">Ngày hẹn</SelectItem>
                <SelectItem value="status">Trạng thái</SelectItem>
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
                {headerGroup.headers.map((header) => {
                  return (
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Đang tải đơn đăng ký viếng của bạn...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Tổng số lượng đã đặt: {table.getFilteredRowModel().rows.length} đơn
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

      {editingRecord && (
        <EditModal
          record={editingRecord}
          onSave={handleSave}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {deleteRecord && (
        <DeleteConfirmationDialog
          open={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRecord(null)}
        />
      )}

      {viewingRecord && (
        <DetailViewDialog
          record={viewingRecord}
          onClose={() => setViewingRecord(null)}
        />
      )}
    </div>
  );
}
