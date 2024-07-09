"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Eye, ShoppingCart, ArrowUpDown, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import ContractDetailsDialog from "./ContractDetailsDialog";
import VisitScheduleDialog from "./VisitScheduleDialog"; // Import VisitScheduleDialog

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Overdue":
      return "destructive";
    case "Inactive":
      return "destructive";
    case "Active":
      return "green";
    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "Overdue":
      return "Quá hạn";
    case "Inactive":
      return "Không hoạt động";
    case "Active":
      return "Hoạt động";
    default:
      return "Không xác định";
  }
};

export type Contract = {
  contractId: number;
  nicheName: string;
  customerName: string;
  deceasedName?: string;
  status: string;
  deceasedRelationshipWithCustomer?: string;
  startDate: string;
  endDate: string;
};

interface CustomerContractListProps {
  contracts: Contract[];
  onSelect: (contract: Contract) => void;
}

const CustomerContractList: React.FC<CustomerContractListProps> = ({
  contracts = [],
  onSelect,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "contractId", desc: false },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Contract[]>(contracts);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFilteredData(contracts);
  }, [contracts]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = contracts.filter((item: Contract) =>
      Object.keys(item).some((key) =>
        String(item[key as keyof Contract])
          .toLowerCase()
          .includes(lowercasedFilter)
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, contracts]);

  const handleServiceClick = () => {
    router.push("/service-order");
  };

  const handleVisitClick = (contract: Contract) => {
    setSelectedContract(contract);
    setIsVisitDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContract(null);
  };

  const handleVisitDialogClose = () => {
    setIsVisitDialogOpen(false);
    setSelectedContract(null);
  };

  const handleDialogSubmit = () => {
    setIsDialogOpen(false);
    setSelectedContract(null);
  };

  const columns: ColumnDef<Contract>[] = [
    {
      id: "stt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "contractId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã HĐ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("contractId")}</div>
      ),
    },
    {
      accessorKey: "nicheName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Địa chỉ Ô
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("nicheName")}</div>
      ),
    },
    {
      accessorKey: "deceasedName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên người mất
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("deceasedName") || "Không có thông tin"}
        </div>
      ),
    },
    {
      accessorKey: "deceasedRelationshipWithCustomer",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quan hệ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("deceasedRelationshipWithCustomer") ||
            "Không có thông tin"}
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày bắt đầu
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("startDate")}</div>
      ),
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng Thái
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant={getStatusVariant(row.getValue("status"))}>
            {getStatusText(row.getValue("status")) || "Không có thông tin"}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Hành Động",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedContract(row.original);
                    setIsDialogOpen(true);
                  }}
                  className="text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem chi tiết hợp đồng</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick();
                  }}
                  className="text-green-600"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Đặt dịch vụ</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVisitClick(row.original);
                  }}
                  className="text-purple-600"
                >
                  <CalendarClock className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Đăng ký viếng thăm</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData ?? [], // Ensure filteredData is not undefined
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
    pageCount: Math.ceil((filteredData?.length ?? 0) / pagination.pageSize), // Ensure filteredData.length is not undefined
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold text-center">Hợp đồng của tôi</h2>
        <Input
          placeholder="Tìm kiếm..."
          onChange={handleSearch}
          className="max-w-sm pl-4 ml-auto"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-center bg-gray-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TooltipProvider key={row.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableRow
                        onClick={() => {
                          setSelectedContract(row.original);
                          setIsDialogOpen(true);
                        }}
                        className="cursor-pointer"
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent>Xem chi tiết</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Tổng số lượng: {table.getFilteredRowModel().rows.length}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
      {isDialogOpen && selectedContract && (
        <ContractDetailsDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          contractId={selectedContract.contractId}
        />
      )}
      {isVisitDialogOpen && selectedContract && (
        <VisitScheduleDialog
          isOpen={isVisitDialogOpen}
          onClose={handleVisitDialogClose}
          onSubmit={handleDialogSubmit}
          selectedContainer={selectedContract}
        />
      )}
    </div>
  );
};

export default CustomerContractList;
