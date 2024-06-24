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
}: {
  containers: any[];
  onSelect: (container: any) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Danh sách ô chứa và hợp đồng</h2>
      <div className="overflow-x-auto">
        <Table className="w-full border border-gray-200 shadow-md rounded-md">
          <TableHeader className="bg-gray-100 ">
            <TableRow>
              <TableHead className="border-b border-gray-200 p-4">
                STT
              </TableHead>
              <TableHead className="border-b border-gray-200 p-4">
                Mã ô
              </TableHead>
              <TableHead className="border-b border-gray-200 p-4">
                Mã HĐ
              </TableHead>
              <TableHead className="border-b border-gray-200 p-4">
                Tên người mất
              </TableHead>
              <TableHead className="border-b border-gray-200 p-4">
                Trạng Thái
              </TableHead>
              <TableHead className="border-b border-gray-200 p-4">
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
                    <Badge variant={getStatusVariant(container.contractStatus)}>
                      {container.contractStatus || "Không có thông tin"}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-b border-gray-200 p-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => onSelect(container)}
                    >
                      Xem Chi Tiết
                    </Button>
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
    </div>
  );
}
