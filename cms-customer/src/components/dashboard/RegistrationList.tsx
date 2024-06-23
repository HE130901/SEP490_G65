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

export default function RegistrationList({ registrations, onEdit, onDelete }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh Sách Đơn Đăng Ký</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ô Chứa</TableHead>
            <TableHead>Ngày Tạo</TableHead>
            <TableHead>Ngày Hẹn</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.containerName}</TableCell>
              <TableCell>
                {item.visitDateTime
                  ? new Date(item.visitDateTime).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                {item.extendedDate
                  ? new Date(item.extendedDate).toLocaleString()
                  : item.terminatedDate
                  ? new Date(item.terminatedDate).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === "Đã Gia Hạn"
                      ? "green"
                      : item.status === "Đã Thanh Lý"
                      ? "red"
                      : "gray"
                  }
                >
                  {item.status || "Đã Đăng Ký"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {item.visitDateTime && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          onEdit(index, {
                            containerName: item.containerName,
                            visitDateTime: item.visitDateTime,
                            note: item.note,
                          })
                        }
                      >
                        Chỉnh Sửa
                      </Button>
                      <Button variant="outline" onClick={() => onDelete(index)}>
                        Hủy
                      </Button>
                    </>
                  )}
                  {item.extendedDate && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          onEdit(index, {
                            containerName: item.containerName,
                            extendedDate: item.extendedDate,
                            status: item.status,
                          })
                        }
                      >
                        Sửa
                      </Button>
                      <Button variant="outline" onClick={() => onDelete(index)}>
                        Xóa
                      </Button>
                    </>
                  )}
                  {item.terminatedDate && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          onEdit(index, {
                            containerName: item.containerName,
                            terminatedDate: item.terminatedDate,
                            status: item.status,
                          })
                        }
                      >
                        Sửa
                      </Button>
                      <Button variant="outline" onClick={() => onDelete(index)}>
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
