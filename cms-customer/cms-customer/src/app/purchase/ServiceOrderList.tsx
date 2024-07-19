"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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
  serviceOrderDetails: {
    $values: ServiceOrderDetail[];
  };
};

export default function OrderList({
  reFetchTrigger,
}: {
  reFetchTrigger: boolean;
}) {
  const { setOrders, fetchOrders, orders = [], user } = useStateContext();
  const [editingRecord, setEditingRecord] = useState<ServiceOrder | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ServiceOrder | null>(null);

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

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold">Đơn đặt hàng</h2>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Địa chỉ ô chứa</TableCell>
              <TableCell>Dịch vụ/Sản phẩm</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map(
                (
                  row: {
                    serviceOrderId: any;
                    createdDate: any;
                    orderDate: any;
                    serviceOrderDetails: any;
                    nicheAddress?: string;
                  },
                  index: number
                ) => (
                  <TableRow key={row.serviceOrderId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.serviceOrderId}</TableCell>
                    <TableCell>
                      {new Date(row.createdDate).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(row.orderDate).toLocaleString()}
                    </TableCell>
                    <TableCell>{row.nicheAddress}</TableCell>
                    <TableCell>
                      {row.serviceOrderDetails.$values.map(
                        (
                          detail: {
                            serviceName: string;
                            quantity: number;
                          },
                          i: React.Key | null | undefined
                        ) => (
                          <div key={i}>
                            {detail.serviceName} x {detail.quantity}
                          </div>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {row.serviceOrderDetails.$values.map(
                        (
                          detail: {
                            status: string;
                          },
                          i: React.Key | null | undefined
                        ) => (
                          <div key={i}>
                            <Badge
                              variant={
                                detail.status === "Pending" ? "standard" : "dot"
                              }
                            >
                              {detail.status}
                            </Badge>
                          </div>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(row as ServiceOrder)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(row as ServiceOrder)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
        />
      )}
    </div>
  );
}
