"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axios-config";

export default function ContainerDetailsDialog({
  isOpen,
  onClose,
  containerId,
}) {
  const [containerDetails, setContainerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && containerId) {
      setLoading(true);
      const fetchContainerDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/Niches/${containerId}`
          );
          setContainerDetails(response.data);
          setError(null);
        } catch (err) {
          console.error("Error fetching container details:", err);
          setError("Không thể tải thông tin chi tiết của ô chứa.");
        } finally {
          setLoading(false);
        }
      };

      fetchContainerDetails();
    }
  }, [isOpen, containerId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chi Tiết Ô Chứa</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-md font-bold mb-1">Địa Chỉ Ô Chứa</h4>
              <p>{containerDetails?.nicheAddress}</p>
            </div>
            <div>
              <h4 className="text-md font-bold mb-1">Mô Tả Ô Chứa</h4>
              <p>{containerDetails?.nicheDescription || "Không có mô tả"}</p>
            </div>
            <div>
              <h4 className="text-md font-bold mb-1">Tên Khách Hàng</h4>
              <p>{containerDetails?.customerName || "Không có thông tin"}</p>
            </div>
            <div>
              <h4 className="text-md font-bold mb-1">Tên Người Đã Mất</h4>
              <p>{containerDetails?.deceasedName || "Không có thông tin"}</p>
            </div>
            <div>
              <h4 className="text-md font-bold mb-1">Ngày Ký Hợp Đồng</h4>
              <p>{containerDetails?.startDate || "Không có thông tin"}</p>
            </div>
            <div>
              <h4 className="text-md font-bold mb-1">Ngày Kết Thúc Hợp Đồng</h4>
              <p>{containerDetails?.endDate || "Không có thông tin"}</p>
            </div>
            <div>
              <h4 className="text-md font-bold mb-1">Trạng Thái Hợp Đồng</h4>
              <p>{containerDetails?.contractStatus || "Không có thông tin"}</p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
