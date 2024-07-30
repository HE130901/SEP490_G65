"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, Eye } from "lucide-react";
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
import { useStateContext } from "@/context/StateContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import DetailViewDialog from "./DetailViewDialog";
import EditModal from "./EditModal";
import debounce from "lodash.debounce";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { remove as removeDiacritics } from "diacritics";

export type NicheReservation = {
  reservationId: number;
  nicheId: number;
  nicheAddress: string;
  createdDate: string;
  confirmationDate: string;
  status: string;
  signAddress: string;
  phoneNumber: string;
  note: string;
  name: string;
  reservationCode: string;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Approved":
    case "Signed":
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
    case "Signed":
      return "Đã ký hợp đồng";
    default:
      return "Không xác định";
  }
};

export default function BookingRequestList({
  reFetchTrigger,
}: {
  reFetchTrigger: boolean;
}) {
  const {
    user,
    nicheReservations,
    fetchNicheReservations,
    updateNicheReservation,
    deleteNicheReservation,
  } = useStateContext();
  const [filteredData, setFilteredData] =
    useState<NicheReservation[]>(nicheReservations);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [editingRecord, setEditingRecord] = useState<NicheReservation | null>(
    null
  );
  const [deleteRecord, setDeleteRecord] = useState<NicheReservation | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<NicheReservation | null>(
    null
  );
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  const [searchField, setSearchField] = useState("all");

  useEffect(() => {
    if (user && user.phone) {
      fetchNicheReservations(user.phone);
    }
  }, [user, reFetchTrigger, fetchNicheReservations]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = nicheReservations.filter((item: any) =>
      Object.keys(item).some((key) =>
        String(item[key as keyof NicheReservation])
          .toLowerCase()
          .includes(lowercasedFilter)
      )
    );
    setFilteredData(filteredData);
  }, [searchTerm, nicheReservations]);

  const handleEdit = (record: NicheReservation, event: React.MouseEvent) => {
    event.stopPropagation();
    if (record.status === "Approved" || record.status === "Canceled") {
      toast.error("Không thể sửa đơn đặt chỗ đã được duyệt hoặc hủy");
      return;
    }
    setEditingRecord(record);
    setCurrentModal("edit");
  };

  const handleDeleteConfirmation = (
    record: NicheReservation,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (
      record.status === "Approved" ||
      record.status === "Canceled" ||
      record.status === "Expired"
    ) {
      toast.error("Không thể xóa đơn đặt chỗ đã được duyệt hoặc hủy");
      return;
    }
    setDeleteRecord(record);
    setCurrentModal("delete");
  };

  const handleView = (
    record: NicheReservation,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setViewingRecord(record);
    setCurrentModal("view");
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;

    await deleteNicheReservation(deleteRecord.reservationId);
    setCurrentModal(null);
  };

  const handleSave = async (updatedRecord: NicheReservation) => {
    await updateNicheReservation(updatedRecord);
    setCurrentModal(null);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const columns: ColumnDef<NicheReservation>[] = [
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
      accessorKey: "reservationCode",
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
        <div className="text-center">{row.getValue("reservationCode")}</div>
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
      cell: (info) => formatDate(info.getValue() as string),
    },
    {
      accessorKey: "confirmationDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày hẹn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => formatDate(info.getValue() as string),
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => handleView(row.original, event)}
                  className="text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => handleEdit(row.original, event)}
                  disabled={
                    row.original.status === "Approved" ||
                    row.original.status === "Canceled" ||
                    row.original.status === "Expired" ||
                    row.original.status === "Signed"
                  }
                  className="text-orange-600"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chỉnh sửa</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) =>
                    handleDeleteConfirmation(row.original, event)
                  }
                  disabled={
                    row.original.status === "Approved" ||
                    row.original.status === "Canceled" ||
                    row.original.status === "Expired" ||
                    row.original.status === "Signed"
                  }
                  className="text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xóa</TooltipContent>
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

  // Hàm chuẩn hóa và lọc dữ liệu
  const normalizeText = (text: string) => {
    return removeDiacritics(text.toLowerCase());
  };
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const normalizedTerm = normalizeText(term);
      const filtered = nicheReservations.filter(
        (nicheReservation: NicheReservation) => {
          if (searchField === "all") {
            return (
              normalizeText(`ĐC-${nicheReservation.reservationId}`).includes(
                normalizedTerm
              ) ||
              normalizeText(nicheReservation.nicheAddress).includes(
                normalizedTerm
              ) ||
              normalizeText(nicheReservation.createdDate).includes(
                normalizedTerm
              ) ||
              normalizeText(nicheReservation.confirmationDate).includes(
                normalizedTerm
              ) ||
              normalizeText(getStatusText(nicheReservation.status)).includes(
                normalizedTerm
              ) ||
              normalizeText(nicheReservation.note || "").includes(
                normalizedTerm
              )
            );
          } else if (searchField === "reservationId") {
            return normalizeText(
              `HĐ-${nicheReservation.reservationId}`
            ).includes(normalizedTerm);
          } else if (searchField === "status") {
            return normalizeText(
              getStatusText(nicheReservation.status)
            ).includes(normalizedTerm);
          } else {
            const fieldValue = normalizeText(
              String(
                nicheReservation[searchField as keyof NicheReservation] || ""
              )
            );
            return fieldValue.includes(normalizedTerm);
          }
        }
      );
      setFilteredData(filtered);
    }, 300),
    [nicheReservations, searchField]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold text-center">Đơn đặt ô chứa</h2>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TooltipProvider key={row.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableRow
                        onClick={() => handleView(row.original)}
                        className="cursor-pointer"
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent>Xem chi tiết</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Đang tải đơn đặt chỗ của bạn ...
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

      {currentModal === "edit" && editingRecord && (
        <EditModal
          record={editingRecord}
          onSave={handleSave}
          onClose={() => setCurrentModal(null)}
        />
      )}

      {currentModal === "delete" && deleteRecord && (
        <DeleteConfirmationDialog
          open={true}
          onConfirm={handleDelete}
          onCancel={() => setCurrentModal(null)}
        />
      )}

      {currentModal === "view" && viewingRecord && (
        <DetailViewDialog
          open={true}
          record={viewingRecord}
          onClose={() => setCurrentModal(null)}
        />
      )}
    </div>
  );
}
