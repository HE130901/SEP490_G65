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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axiosInstance";
import ExtendContractDialog from "./ExtendContractDialog"; // Import the new dialog

export default function ContainerDetailsDialog({
  isOpen,
  onClose,
  containerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  containerId: number | null;
}) {
  const [containerDetails, setContainerDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExtendDialogOpen, setExtendDialogOpen] = useState(false);

  useEffect(() => {
    const fetchContainerDetails = async () => {
      if (!containerId) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/Niches/${containerId}`);
        setContainerDetails(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching container details:", err);
        setError("Không thể tải thông tin chi tiết của ô chứa.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchContainerDetails();
    }
  }, [isOpen, containerId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className="grid gap-1">
              <p className="">
                Chi tiết Ô Chứa : {containerDetails?.nicheAddress}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        {loading ? (
          <p className="text-center text-gray-600">Đang tải...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid gap-6 p-6">
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Tên Khách Hàng</p>
                  <p className="text-sm">
                    {containerDetails?.customerName || "Không có thông tin"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Tên Người Đã Mất</p>
                  <p className="text-sm">
                    {containerDetails?.deceasedName || "Không có thông tin"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Ngày Ký Hợp Đồng</p>
                  <p className="text-sm">
                    {containerDetails?.startDate || "Không có thông tin"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Ngày Kết Thúc Hợp Đồng</p>
                  <p className="text-sm">
                    {containerDetails?.endDate || "Không có thông tin"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Trạng Thái Hợp Đồng</p>
                  <Badge
                    variant={
                      containerDetails?.contractStatus === "Quá hạn"
                        ? "destructive"
                        : "green"
                    }
                    className="w-fit px-3 py-1"
                  >
                    {containerDetails?.contractStatus || "Không có thông tin"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="default"
            onClick={() => setExtendDialogOpen(true)}
            disabled={loading}
          >
            Gia hạn hợp đồng
          </Button>
        </DialogFooter>
      </DialogContent>
      <ExtendContractDialog
        isOpen={isExtendDialogOpen}
        onClose={() => setExtendDialogOpen(false)}
        containerId={containerId}
      />
    </Dialog>
  );
}
