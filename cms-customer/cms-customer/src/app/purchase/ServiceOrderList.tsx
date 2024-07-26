"use client";

import * as React from "react";
import { useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import { useStateContext } from "@/context/StateContext";
import ServiceOrderAPI from "@/services/serviceOrderService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDateDialog from "./EditDateDialog";
import DetailViewDialog from "./DetailViewDialog";

export type ServiceOrderDetail = {
  serviceName: string;
  quantity: number;
  status: string;
  completionImage?: string;
};

export type ServiceOrder = {
  serviceOrderId: number;
  nicheAddress: string;
  createdDate: string;
  orderDate: string;
  serviceOrderCode: string;
  serviceOrderDetails: {
    $values: ServiceOrderDetail[];
  };
};

const columnHelper = createColumnHelper<ServiceOrder>();
export default function ServiceOrderList({
  reFetchTrigger,
}: {
  reFetchTrigger: boolean;
}) {
  const { setOrders, fetchOrders, orders = [], user } = useStateContext();
  const [editingRecord, setEditingRecord] = React.useState<ServiceOrder | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = React.useState<ServiceOrder | null>(
    null
  );

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders, reFetchTrigger]);

  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const response = await ServiceOrderAPI.getAllByCustomer();
        console.log("Service orders fetched:", response.data); // Debugging line
        setOrders(response.data.$values); // Unwrapping the $values
      } catch (error) {
        console.error("Error fetching service orders:", error);
        toast.error("Không thể lấy danh sách đơn đặt hàng.");
      }
    };

    fetchServiceOrders();
  }, [fetchOrders, reFetchTrigger, setOrders]);

  const handleEdit = (record: ServiceOrder) => {
    const hasPendingStatus = record.serviceOrderDetails.$values.some(
      (detail) => detail.status === "Pending"
    );
    if (hasPendingStatus) {
      setEditingRecord(record);
      setViewingRecord(null);
    } else {
      toast.warning(
        "Chỉ có thể chỉnh sửa đơn đặt hàng có trạng thái 'Pending'."
      );
    }
  };

  const handleView = (record: ServiceOrder) => {
    setViewingRecord(record);
    setEditingRecord(null);
  };

  const handleSave = async (updatedRecord: ServiceOrder) => {
    try {
      if (!updatedRecord.serviceOrderId) {
        console.error("Invalid serviceOrderId:", updatedRecord.serviceOrderId);
        return;
      }
      const dataToUpdate = {
        serviceOrderId: updatedRecord.serviceOrderId,
        orderDate: updatedRecord.orderDate,
      };
      console.log("Sending update request with data:", dataToUpdate); // Debugging line
      await ServiceOrderAPI.update(updatedRecord.serviceOrderId, dataToUpdate);
      toast.success("Cập nhật đơn đặt hàng thành công!");
      setEditingRecord(null);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Không thể cập nhật đơn đặt hàng.");
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("serviceOrderCode", {
        header: "Mã đơn hàng",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("createdDate", {
        header: "Ngày tạo",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      }),
      columnHelper.accessor("orderDate", {
        header: "Ngày hẹn",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      }),
      columnHelper.accessor("nicheAddress", {
        header: "Địa chỉ ô chứa",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("serviceOrderDetails.$values", {
        header: "Dịch vụ/Sản phẩm",
        cell: (info) => (
          <>
            {info.getValue().map((detail: ServiceOrderDetail, i: number) => (
              <div key={i}>
                {detail.serviceName} x {detail.quantity}
              </div>
            ))}
          </>
        ),
      }),
      columnHelper.accessor("serviceOrderDetails.$values", {
        header: "Trạng thái",
        cell: (info) => (
          <>
            {info.getValue().map((detail: ServiceOrderDetail, i: number) => (
              <div key={i}>
                <Badge
                  variant={detail.status === "Pending" ? "standard" : "dot"}
                >
                  {detail.status}
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
          <>
            <Tooltip title="Xem chi tiết">
              <IconButton
                color="primary"
                onClick={() => handleView(props.row.original)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                color="primary"
                onClick={() => handleEdit(props.row.original)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold">Danh sách đơn đặt hàng</h2>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                <TableCell colSpan={columns.length} align="center">
                  Bạn chưa có đơn đặt hàng.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          onSave={(record) => handleSave(record)}
        />
      )}
    </div>
  );
}
