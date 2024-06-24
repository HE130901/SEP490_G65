"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

export default function ContainerList({
  containers = [],
  onSelect,
  onVisitSchedule,
  onServiceOrder,
}: {
  containers: any[];
  onSelect: (container: any) => void;
  onVisitSchedule: (container: any) => void;
  onServiceOrder: (container: any) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách ô chứa và hợp đồng</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Mã ô</TableHead>
            <TableHead>Mã HĐ</TableHead>
            <TableHead>Tên người mất</TableHead> {/* Thêm cột Tên người mất */}
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.length > 0 ? (
            containers.map((container, index) => (
              <TableRow key={container.nicheId}>
                <TableCell>{index + 1}</TableCell> {/* STT */}
                <TableCell>{container.nicheId}</TableCell>
                <TableCell>
                  {container.contractId || "Không có mã HĐ"}
                </TableCell>
                <TableCell>
                  {container.deceasedName || "Không có thông tin"}
                </TableCell>{" "}
                {/* Hiển thị Tên người mất */}
                <TableCell>
                  <Badge variant={getStatusVariant(container.contractStatus)}>
                    {container.contractStatus || "Không có thông tin"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => onSelect(container)}
                    >
                      Xem Chi Tiết
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onVisitSchedule(container)}
                    >
                      Đặt Lịch Viếng
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onServiceOrder(container)}
                    >
                      Đặt Dịch Vụ
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>Không có dữ liệu</TableCell>{" "}
              {/* Điều chỉnh colSpan để phù hợp với số cột mới */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
