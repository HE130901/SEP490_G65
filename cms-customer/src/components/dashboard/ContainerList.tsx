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
import { mapStatusToVietnamese } from "@/utils/statusMapper";

export default function ContainerList({
  containers = [], // Default to empty array if not provided
  onSelect,
  onVisitSchedule,
  onServiceOrder,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh Sách Ô Chứa</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã Ô Chứa</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.length > 0 ? (
            containers.map((container) => (
              <TableRow key={container.nicheId}>
                <TableCell>{container.nicheId}</TableCell>
                <TableCell>
                  <Badge
                    variant={container.status === "Active" ? "green" : "red"}
                  >
                    {mapStatusToVietnamese(container.status)}
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
              <TableCell colSpan={3}>Không có dữ liệu</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
