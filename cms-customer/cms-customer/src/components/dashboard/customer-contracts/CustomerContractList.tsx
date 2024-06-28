"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Visibility as VisibilityIcon,
  Event as VisitIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ShoppingCartCheckoutSharpIcon from "@mui/icons-material/ShoppingCartCheckoutSharp";
import { useRouter } from "next/navigation";
import VisitScheduleDialog from "./VisitScheduleDialog";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Quá hạn":
      return "destructive";
    case "Trong hạn":
      return "green";
    default:
      return "secondary";
  }
};

export default function CustomerContractList({
  containers = [],
  onSelect,
}: {
  containers: any[];
  onSelect: (container: any) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const router = useRouter();

  const handleServiceClick = (container: any) => {
    router.push("/service-order");
  };

  const handleVisitClick = (container: any) => {
    setSelectedContainer(container);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContainer(null);
  };

  const handleDialogSubmit = () => {
    setIsDialogOpen(false);
    setSelectedContainer(null);
  };

  return (
    <TooltipProvider>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Hợp đồng của tôi
        </h2>
        <div className="overflow-x-auto rounded-md">
          <Table className="w-full border border-gray-200 shadow-md ">
            <TableHeader className="bg-gray-100 ">
              <TableRow>
                <TableHead className="border-b border-gray-200 p-4 text-center">
                  STT
                </TableHead>
                <TableHead className="border-b border-gray-200 p-4 text-center">
                  Mã ô
                </TableHead>
                <TableHead className="border-b border-gray-200 p-4 text-center">
                  Mã HĐ
                </TableHead>
                <TableHead className="border-b border-gray-200 p-4 text-center">
                  Tên người mất
                </TableHead>
                <TableHead className="border-b border-gray-200 p-4 text-center">
                  Trạng Thái
                </TableHead>
                <TableHead className="border-b border-gray-200 p-4 text-center">
                  Hành Động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.length > 0 ? (
                containers.map((container, index) => (
                  <TableRow
                    key={container.nicheId}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <TableCell className="border-b border-gray-200 p-4 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-4 text-center">
                      {container.nicheId}
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-4 text-center">
                      {container.contractId || "Không có mã HĐ"}
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-4 text-center">
                      {container.deceasedName || "Không có thông tin"}
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-4 text-center">
                      <Badge
                        variant={getStatusVariant(container.contractStatus)}
                      >
                        {container.contractStatus || "Không có thông tin"}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-b border-gray-200 p-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <IconButton
                              color="primary"
                              onClick={() => onSelect(container)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TooltipTrigger>
                          <TooltipContent>Xem chi tiết hợp đồng</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <IconButton
                              color="success"
                              onClick={() => handleServiceClick(container)}
                            >
                              <ShoppingCartCheckoutSharpIcon />
                            </IconButton>
                          </TooltipTrigger>
                          <TooltipContent>Đặt dịch vụ</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <IconButton
                              color="secondary"
                              onClick={() => handleVisitClick(container)}
                            >
                              <VisitIcon />
                            </IconButton>
                          </TooltipTrigger>
                          <TooltipContent>Đăng ký viếng thăm</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-4 text-center text-gray-500"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {isDialogOpen && (
          <VisitScheduleDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onSubmit={handleDialogSubmit}
            selectedContainer={selectedContainer} // Pass the selected container
          />
        )}
      </div>
    </TooltipProvider>
  );
}
