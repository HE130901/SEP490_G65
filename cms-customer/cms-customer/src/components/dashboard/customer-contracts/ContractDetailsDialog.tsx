"use client";

import * as React from "react";
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
import ContractAPI from "@/services/contractService";
import ExtendContractDialog from "./ExtendContractDialog";
import LiquidateContractDialog from "./LiquidateContractDialog";
import { useRouter } from "next/navigation";
import {
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";

export default function ContractDetailsDialog({
  isOpen,
  onClose,
  contractId,
}: {
  isOpen: boolean;
  onClose: () => void;
  contractId: number | null;
}) {
  const [contractDetails, setContractDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExtendDialogOpen, setExtendDialogOpen] = useState(false);
  const [isLiquidateDialogOpen, setLiquidateDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!contractId) return;

      setLoading(true);
      try {
        const response = await ContractAPI.getContractDetail(contractId);
        console.log("API response:", response.data); // Log API response for debugging
        setContractDetails(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching contract details:", err);
        setError("Không thể tải thông tin chi tiết của hợp đồng.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchContractDetails();
    }
  }, [isOpen, contractId]);

  const handleExtendClick = () => {
    console.log("Extend button clicked");
    setExtendDialogOpen(true);
  };

  const handleLiquidateClick = () => {
    console.log("Liquidate button clicked");
    setLiquidateDialogOpen(true);
  };

  useEffect(() => {
    console.log("isExtendDialogOpen: ", isExtendDialogOpen);
    console.log("isLiquidateDialogOpen: ", isLiquidateDialogOpen);
  }, [isExtendDialogOpen, isLiquidateDialogOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className="grid gap-1">
              <p className="">
                Chi tiết Hợp Đồng: {contractDetails?.contractId}
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
                    {contractDetails?.customerName || "Không có thông tin"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Email Khách Hàng</p>
                  <p className="text-sm">
                    {contractDetails?.customerEmail || "Không có thông tin"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">
                    Số điện thoại Khách Hàng
                  </p>
                  <p className="text-sm">
                    {contractDetails?.customerPhone || "Không có thông tin"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Địa chỉ Khách Hàng</p>
                  <p className="text-sm">
                    {contractDetails?.customerAddress || "Không có thông tin"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Tên Người Đã Mất</p>
                  <p className="text-sm">
                    {contractDetails?.deceasedName || "Không có thông tin"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Ngày Sinh Người Đã Mất</p>
                  <p className="text-sm">
                    {contractDetails?.deceasedDateOfBirth ||
                      "Không có thông tin"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Ngày Mất Người Đã Mất</p>
                  <p className="text-sm">
                    {contractDetails?.deceasedDateOfDeath ||
                      "Không có thông tin"}
                  </p>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Số Giấy Chứng Tử</p>
                  <p className="text-sm">
                    {contractDetails?.deceasedDeathCertificateNumber ||
                      "Không có thông tin"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Trạng Thái Hợp Đồng</p>
                  <Badge
                    variant={
                      contractDetails?.status === "Overdue"
                        ? "destructive"
                        : "green"
                    }
                    className="w-fit px-3 py-1"
                  >
                    {contractDetails?.status || "Không có thông tin"}
                  </Badge>
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Ghi chú</p>
                  <p className="text-sm">
                    {contractDetails?.note || "Không có thông tin"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="flex justify-center space-x-2">
          <Tooltip title="Gia hạn hợp đồng">
            <span>
              <Button
                onClick={handleExtendClick}
                disabled={loading}
                variant="green"
              >
                <HistorySharpIcon /> Gia hạn
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Thanh lý hợp đồng">
            <span>
              <Button
                onClick={handleLiquidateClick}
                disabled={loading}
                variant="destructive"
              >
                <DeleteIcon /> Thanh lý
              </Button>
            </span>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
      <ExtendContractDialog
        isOpen={isExtendDialogOpen}
        onClose={() => {
          console.log("Closing Extend Contract Dialog");
          setExtendDialogOpen(false);
        }}
        contractId={contractId}
      />
      <LiquidateContractDialog
        isOpen={isLiquidateDialogOpen}
        onClose={() => {
          console.log("Closing Liquidate Contract Dialog");
          setLiquidateDialogOpen(false);
        }}
        contractId={contractId}
      />
    </Dialog>
  );
}
