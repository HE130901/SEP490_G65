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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
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
import VisitRegistrationAPI from "@/api/visitRegistrationApi";

// Define your VisitRegistration type
export type VisitRegistration = {
  visitId: number;
  customerId: number;
  nicheId: number;
  createdDate: string;
  visitDate: string;
  status: string;
  accompanyingPeople: number;
  note: string;
};

// RegistrationList component
export default function RegistrationList({
  reFetchTrigger,
}: {
  reFetchTrigger: boolean;
}) {
  const { visitRegistrations, fetchVisitRegistrations, user } =
    useStateContext();
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

  const [editingRecord, setEditingRecord] = useState<VisitRegistration | null>(
    null
  );

  useEffect(() => {
    if (user && user.customerId) {
      fetchVisitRegistrations(user.customerId);
    }
  }, [user, fetchVisitRegistrations, reFetchTrigger]);

  const handleEdit = (record: VisitRegistration) => {
    setEditingRecord(record);
  };

  const handleDelete = async (visitId: number) => {
    if (confirm("Bạn có chắc muốn xóa đơn đặt chỗ này không?")) {
      try {
        console.log(
          "[RegistrationList] Deleting visit registration with ID:",
          visitId
        ); // Debugging output
        await VisitRegistrationAPI.delete(visitId);
        fetchVisitRegistrations(user.customerId); // Refetch the data after deletion
      } catch (error) {
        console.error(
          "Error deleting visit registration:",
          error.response ?? error
        );
        alert("Không thể xóa đơn đặt chỗ.");
      }
    }
  };

  const handleSave = async (updatedRecord: VisitRegistration) => {
    try {
      if (!updatedRecord.visitId) {
        console.error("Invalid visitId:", updatedRecord.visitId);
        return;
      }
      // Create an object with only the required fields
      const dataToUpdate = {
        visitDate: updatedRecord.visitDate,
        note: updatedRecord.note,
        accompanyingPeople: updatedRecord.accompanyingPeople,
      };
      await VisitRegistrationAPI.update(updatedRecord.visitId, dataToUpdate);
      setEditingRecord(null);
      fetchVisitRegistrations(user.customerId); // Refetch the data after updating
    } catch (error) {
      console.error("Error updating visit registration:", error);
      alert("Không thể cập nhật đơn đặt chỗ.");
    }
  };

  // Column definitions with inline handleEdit and handleDelete functions
  const columns: ColumnDef<VisitRegistration>[] = [
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
      accessorKey: "visitId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã đơn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("visitId")}</div>,
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
        <div>{new Date(row.getValue("createdDate")).toLocaleString()}</div>
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
        <div>{new Date(row.getValue("visitDate")).toLocaleString()}</div>
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
          variant={
            row.getValue("status") === "Đang chờ duyệt" ? "gray" : "green"
          }
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
            onClick={() => handleDelete(row.original.visitId)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: visitRegistrations,
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
    pageCount: Math.ceil(visitRegistrations.length / pagination.pageSize),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold">Danh sách đơn đăng ký viếng</h2>
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
    </div>
  );
}

type EditModalProps = {
  record: VisitRegistration;
  onSave: (updatedRecord: VisitRegistration) => void;
  onClose: () => void;
};

function EditModal({ record, onSave, onClose }: EditModalProps) {
  const [updatedRecord, setUpdatedRecord] = useState(record);

  const handleChange = (field: keyof VisitRegistration, value: any) => {
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
            <label className="block mb-2 font-medium">Ngày Hẹn</label>
            <input
              type="datetime-local"
              value={new Date(updatedRecord.visitDate)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                handleChange("visitDate", new Date(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Số Người Đi Cùng</label>
            <input
              type="number"
              value={updatedRecord.accompanyingPeople}
              onChange={(e) =>
                handleChange("accompanyingPeople", parseInt(e.target.value))
              }
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
