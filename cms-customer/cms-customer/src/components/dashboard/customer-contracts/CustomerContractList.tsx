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
import { Eye, ArrowUpDown } from "lucide-react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HistorySharp from "@mui/icons-material/HistorySharp";
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
import ExtendContractDialog from "./ContractRenewalDialog";
import LiquidateContractDialog from "./ContractTerminationDialog";
import ContractAPI from "@/services/contractService"; // Import your API service
import { useStateContext } from "@/context/StateContext";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "green";
    case "PendingRenewal":
    case "PendingCancellation":
      return "default";
    case "Expired":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "Active":
      return "Hoạt động";
    case "PendingRenewal":
      return "Đang chờ gia hạn";
    case "PendingCancellation":
      return "Đang chờ hủy";
    case "Expired":
      return "Hết hạn";
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
  duration: string;
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
  const [isExtendDialogOpen, setExtendDialogOpen] = useState(false);
  const [isLiquidateDialogOpen, setLiquidateDialogOpen] = useState(false);
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

  const { user } = useStateContext();
  const fetchContracts = async () => {
    try {
      const response = await ContractAPI.getContractsByCustomer(
        user.customerId
      );
      setFilteredData(response.data.$values);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const handleExtendClick = (contract: Contract) => {
    setSelectedContract(contract);
    setExtendDialogOpen(true);
  };

  const handleLiquidateClick = (contract: Contract) => {
    setSelectedContract(contract);
    setLiquidateDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContract(null);
    fetchContracts(); // Fetch contracts after closing dialog
  };

  const handleExtendDialogClose = () => {
    setExtendDialogOpen(false);
    setSelectedContract(null);
    fetchContracts(); // Fetch contracts after closing dialog
  };

  const handleLiquidateDialogClose = () => {
    setLiquidateDialogOpen(false);
    setSelectedContract(null);
    fetchContracts(); // Fetch contracts after closing dialog
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
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
        <div className="text-center">HĐ-{row.getValue("contractId")}</div>
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
        <div className="text-center">
          {formatDate(row.getValue("startDate"))}
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thời hạn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("duration")}</div>
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
                    handleExtendClick(row.original);
                  }}
                  className="text-green-600"
                >
                  <HistorySharp className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Gia hạn hợp đồng</TooltipContent>
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
                    handleLiquidateClick(row.original);
                  }}
                  className="text-red-600"
                >
                  <CancelOutlinedIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Thanh lý hợp đồng</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData ?? [],
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
    pageCount: Math.ceil((filteredData?.length ?? 0) / pagination.pageSize),
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
                  Đang tải hợp đồng của bạn...
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
      {isExtendDialogOpen && selectedContract && (
        <ExtendContractDialog
          isOpen={isExtendDialogOpen}
          onClose={handleExtendDialogClose}
          contractId={selectedContract.contractId}
        />
      )}
      {isLiquidateDialogOpen && selectedContract && (
        <LiquidateContractDialog
          isOpen={isLiquidateDialogOpen}
          onClose={handleLiquidateDialogClose}
          contractId={selectedContract.contractId}
        />
      )}
    </div>
  );
};

export default CustomerContractList;
