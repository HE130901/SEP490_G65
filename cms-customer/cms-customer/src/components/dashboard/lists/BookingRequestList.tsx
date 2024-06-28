"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
import { useStateContext } from "@/context/state-context";
import NicheReservationAPI from "@/services/nicheReservationService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define your NicheReservation type
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

// BookingRequest component
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
  ]); // Default sort
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, // Show custom records per page
  });

  const [editingRecord, setEditingRecord] = useState<NicheReservation | null>(
    null
  );
  const [deleteRecord, setDeleteRecord] = useState<NicheReservation | null>(
    null
  );

  useEffect(() => {
    if (user && user.phone) {
      fetchNicheReservations(user.phone);
    }
  }, [user, reFetchTrigger]);

  const fetchNicheReservations = async (phoneNumber: string) => {
    try {
      const response = await NicheReservationAPI.getByPhoneNumber(phoneNumber);
      setNicheReservations(response.data.$values);
    } catch (error) {
      console.error("Error fetching niche reservations:", error);
      toast.error("Không thể lấy danh sách đơn đặt chỗ.");
    }
  };

  const handleEdit = (record: NicheReservation) => {
    setEditingRecord(record);
  };

  const handleDeleteConfirmation = (record: NicheReservation) => {
    setDeleteRecord(record);
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;

    try {
      await NicheReservationAPI.delete(deleteRecord.reservationId);
      toast.success("Xóa đơn đặt chỗ thành công!");
      fetchNicheReservations(user.phone); // Refetch the data after deletion
      setDeleteRecord(null); // Close the modal
    } catch (error) {
      console.error("Error deleting niche reservation:", error);
      toast.error("Không thể xóa đơn đặt chỗ.");
    }
  };

  const handleSave = async (updatedRecord: NicheReservation) => {
    try {
      if (!updatedRecord.reservationId) {
        console.error("Invalid reservationId:", updatedRecord.reservationId);
        return;
      }
      const dataToUpdate = {
        confirmationDate: updatedRecord.confirmationDate,
        note: updatedRecord.note,
        signAddress: updatedRecord.signAddress,
      };
      await NicheReservationAPI.update(
        updatedRecord.reservationId,
        dataToUpdate
      );
      toast.success("Cập nhật đơn đặt chỗ thành công!");
      setEditingRecord(null);
      fetchNicheReservations(user.phone); // Refetch the data after updating
    } catch (error) {
      console.error("Error updating niche reservation:", error);
      toast.error("Không thể cập nhật đơn đặt chỗ.");
    }
  };

  // Column definitions with inline handleEdit and handleDelete functions
  const columns: ColumnDef<NicheReservation>[] = [
    {
      id: "stt", // Add an ID for the STT column
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.index + 1, // Calculate the row index + 1 for display
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
      cell: ({ row }) => <div>{row.getValue("reservationId")}</div>,
    },
    {
      accessorKey: "nicheId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã Ô
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("nicheId")}</div>,
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
        <div>
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
          Ngày Xác Nhận
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
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
        <Badge
          variant={row.getValue("status") === "Đang giữ chỗ" ? "gray" : "green"}
        >
          {row.getValue("status")}
        </Badge>
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
      cell: ({ row }) => <div>{row.getValue("note")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Sửa
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteConfirmation(row.original)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: nicheReservations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false, // Use automatic pagination
    pageCount: Math.ceil(nicheReservations.length / pagination.pageSize),
  });

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold">Đơn đặt ô chứa</h2>
        <Input
          placeholder="Tìm kiếm..."
          value={(table.getColumn("nicheId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nicheId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm pl-4 ml-auto"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                  Bạn chưa có đơn đặt chỗ nào.
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

      {/* Editing Modal */}
      {editingRecord && (
        <EditModal
          record={editingRecord}
          onSave={handleSave}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteRecord && (
        <Dialog open={true} onOpenChange={() => setDeleteRecord(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>Bạn có chắc chắn muốn xóa đơn đăng ký này không?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteRecord(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

type EditModalProps = {
  record: NicheReservation;
  onSave: (updatedRecord: NicheReservation) => void;
  onClose: () => void;
};

function EditModal({ record, onSave, onClose }: EditModalProps) {
  const [updatedRecord, setUpdatedRecord] = useState(record);

  const handleChange = (field: keyof NicheReservation, value: any) => {
    setUpdatedRecord({ ...updatedRecord, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(updatedRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa Đơn Đặt Chỗ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Ngày Xác Nhận</label>
            <input
              type="datetime-local"
              value={new Date(updatedRecord.confirmationDate)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                handleChange("confirmationDate", new Date(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Địa Chỉ Ký</label>
            <input
              type="text"
              value={updatedRecord.signAddress}
              onChange={(e) => handleChange("signAddress", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Ghi Chú</label>
            <textarea
              value={updatedRecord.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
