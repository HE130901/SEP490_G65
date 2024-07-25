"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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
import NicheReservationAPI from "@/services/nicheReservationService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import DetailViewDialog from "./DetailViewDialog";
import EditModal from "./EditModal";

export type NicheReservation = {
  reservationId: number;
  nicheId: number;
  createdDate: string;
  confirmationDate: string;
  status: string;
  signAddress: string;
  phoneNumber: string;
  note: string;
  name: string;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Pending":
      return "default";
    case "Canceled":
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
    default:
      return "Không xác định";
  }
};

export default function BookingRequestList({
  reFetchTrigger,
}: {
  reFetchTrigger: boolean;
}) {
  const { user } = useStateContext();
  const [nicheReservations, setNicheReservations] = useState<
    NicheReservation[]
  >([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(nicheReservations);
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

  useEffect(() => {
    if (user && user.phone) {
      fetchNicheReservations(user.phone);
    }
  }, [user, reFetchTrigger]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = nicheReservations.filter((item) =>
      Object.keys(item).some((key) =>
        String(item[key as keyof NicheReservation])
          .toLowerCase()
          .includes(lowercasedFilter)
      )
    );
    setFilteredData(filteredData);
  }, [searchTerm, nicheReservations]);

  const fetchNicheReservations = async (phoneNumber: string) => {
    try {
      const response = await NicheReservationAPI.getByPhoneNumber(phoneNumber);
      setNicheReservations(response.data.$values);
    } catch (error) {
      console.error("Error fetching niche reservations:", error);
    }
  };

  const handleEdit = (record: NicheReservation, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("handleEdit called with record:", record);
    if (record.status === "Approved" || record.status === "Canceled") {
      toast.error("Không thể sửa đơn đặt chỗ đã được duyệt hoặc hủy");
      return;
    }
    setEditingRecord(record);
    setCurrentModal("edit");
    console.log("currentModal set to edit");
  };

  const handleDeleteConfirmation = (
    record: NicheReservation,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    console.log("handleDeleteConfirmation called with record:", record);
    if (record.status === "Approved" || record.status === "Canceled") {
      toast.error("Không thể xóa đơn đặt chỗ đã được duyệt hoặc hủy");
      return;
    }
    setDeleteRecord(record);
    setCurrentModal("delete");
    console.log("currentModal set to delete");
  };

  const handleView = (
    record: NicheReservation,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("handleView called with record:", record);
    setViewingRecord(record);
    setCurrentModal("view");
    console.log("currentModal set to view");
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;

    try {
      await NicheReservationAPI.delete(deleteRecord.reservationId);
      toast.success("Hủy đơn đặt chỗ thành công!");
      setNicheReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId === deleteRecord.reservationId
            ? { ...reservation, status: "Canceled" }
            : reservation
        )
      );
      setCurrentModal(null); // Close the modal
    } catch (error) {
      console.error("Error canceling niche reservation:", error);
      toast.error("Không thể hủy đơn đặt chỗ.");
    }
  };

  const handleSave = async (updatedRecord: NicheReservation) => {
    try {
      if (!updatedRecord.reservationId) {
        console.error("Invalid reservationId:", updatedRecord.reservationId);
        return;
      }
      const dataToUpdate = {
        reservationId: updatedRecord.reservationId,
        nicheId: updatedRecord.nicheId,
        name: updatedRecord.name,
        confirmationDate: new Date(
          updatedRecord.confirmationDate
        ).toISOString(),
        note: updatedRecord.note,
        signAddress: updatedRecord.signAddress,
        phoneNumber: updatedRecord.phoneNumber,
      };
      await NicheReservationAPI.update(
        updatedRecord.reservationId,
        dataToUpdate
      );
      toast.success("Cập nhật đơn đặt chỗ thành công!");
      setCurrentModal(null); // Close the modal
      fetchNicheReservations(user.phone); // Refetch the data after updating
    } catch (error) {
      console.error("Error updating niche reservation:", error);
      toast.error("Không thể cập nhật đơn đặt chỗ.");
    }
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
      accessorKey: "reservationId",
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
        <div className="text-center">ĐC-{row.getValue("reservationId")}</div>
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
          {new Date(row.getValue("createdDate")).toLocaleString("vi-VN")}
        </div>
      ),
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
      cell: ({ row }) => (
        <div className="text-center">
          {new Date(row.getValue("confirmationDate")).toLocaleString("vi-VN")}
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
      accessorKey: "note",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ghi Chú
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("note")}</div>
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
                    row.original.status === "Canceled"
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
                    row.original.status === "Canceled"
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

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold text-center">Đơn đặt ô chứa</h2>
        <Input
          placeholder="Tìm kiếm..."
          onChange={handleSearch}
          className="max-w-sm pl-4 ml-auto"
        />
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
