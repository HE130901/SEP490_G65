"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStateContext } from "@/context/StateContext";
import ContractAPI from "@/services/contractService";
import { IconButton } from "@mui/material";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { remove as removeDiacritics } from "diacritics";
import debounce from "lodash.debounce";
import { ArrowUpDown, Ban, Eye, History } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import ContractDetailsDialog from "./ContractDetailsDialog";
import ExtendContractDialog from "./ContractRenewalDialog";
import LiquidateContractDialog from "./ContractTerminationDialog";
import ExtendListDialog from "./ExtendListDialog";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Active":
    case "Extended":
      return "green";
    case "PendingRenewal":
    case "PendingCancellation":
      return "default";
    case "Expired":
    case "Canceled":
      return "destructive";
    case "NearlyExpired":
      return "red";

    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "Active":
      return "Hoạt động";
    case "PendingRenewal":
      return "Chờ gia hạn";
    case "PendingCancellation":
      return "Đang chờ hủy";
    case "Expired":
      return "Hết hạn";
    case "Extended":
      return "Đã gia hạn";
    case "Canceled":
      return "Đã thanh lý";
    case "NearlyExpired":
      return "Gần hết hạn";
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
  contractCode: string;
  startDate: string;
  endDate: string;
  duration: string;
  daysLeft: number;
  nicheCode: string;
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
    { id: "contractCode", desc: true },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
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
  const [isExtendListDialogOpen, setExtendListDialogOpen] = useState(false);
  const router = useRouter();

  // Hàm chuẩn hóa và lọc dữ liệu
  const normalizeText = (text: string) => {
    return removeDiacritics(text.toLowerCase());
  };

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const normalizedTerm = normalizeText(term);
      const filtered = contracts.filter((contract: Contract) => {
        if (searchField === "all") {
          return (
            normalizeText(`HĐ-${contract.contractId}`).includes(
              normalizedTerm
            ) ||
            normalizeText(contract.nicheName).includes(normalizedTerm) ||
            normalizeText(contract.customerName).includes(normalizedTerm) ||
            normalizeText(contract.deceasedName || "").includes(
              normalizedTerm
            ) ||
            normalizeText(getStatusText(contract.status)).includes(
              normalizedTerm
            ) ||
            normalizeText(
              contract.deceasedRelationshipWithCustomer || ""
            ).includes(normalizedTerm) ||
            normalizeText(formatDate(contract.startDate)).includes(
              normalizedTerm
            )
          );
        } else if (searchField === "status") {
          return normalizeText(getStatusText(contract.status)).includes(
            normalizedTerm
          );
        } else {
          const fieldValue = normalizeText(
            String(contract[searchField as keyof Contract] || "")
          );
          return fieldValue.includes(normalizedTerm);
        }
      });
      setFilteredData(filtered);
    }, 300),
    [contracts, searchField]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

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

  const handleLiquidateClick = (contract: Contract) => {
    setSelectedContract(contract);
    setLiquidateDialogOpen(true);
  };
  const handleExtendListCLick = (contract: Contract) => {
    setSelectedContract(contract);
    setExtendListDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedContract(null);
    fetchContracts();
  };

  const handleExtendDialogClose = () => {
    setExtendDialogOpen(false);
    setSelectedContract(null);
    fetchContracts();
  };

  const handleLiquidateDialogClose = () => {
    setLiquidateDialogOpen(false);
    setSelectedContract(null);
    fetchContracts();
  };
  const hendleExtendListDialogClose = () => {
    setExtendListDialogOpen(false);
    setSelectedContract(null);
    fetchContracts();
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
      accessorKey: "contractCode",
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
        <div className="text-center">{row.getValue("contractCode")}</div>
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
        <div className="text-left">
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
      accessorKey: "daysLeft",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày còn lại
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("daysLeft")} ngày</div>
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
                <IconButton
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExtendListCLick(row.original);
                  }}
                  disabled={row.original.status == "Canceled"}
                >
                  <History className="w-4 h-4" />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>Gia hạn hợp đồng</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLiquidateClick(row.original);
                  }}
                  disabled={row.original.status == "Canceled"}
                >
                  <Ban className="w-4 h-4" />
                </IconButton>
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

  const handleSelectChange = (value: string) => {
    setSearchField(value);
  };
  const getSearchFieldLabel = (value: string) => {
    switch (value) {
      case "all":
        return "Tất cả";
      case "contractId":
        return "Mã HĐ";
      case "nicheName":
        return "Địa chỉ Ô";
      case "deceasedName":
        return "Tên người mất";
      case "status":
        return "Trạng thái";
      default:
        return "Tất cả";
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center py-4">
        <h2 className="text-2xl font-bold text-center">Hợp đồng của tôi</h2>
        <div className="flex items-center ml-auto space-x-4">
          <div className="w-36">
            <Select value={searchField} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <span>{getSearchFieldLabel(searchField)}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="contractId">Mã HĐ</SelectItem>
                <SelectItem value="nicheName">Địa chỉ Ô</SelectItem>
                <SelectItem value="deceasedName">Tên người mất</SelectItem>
                <SelectItem value="status">Trạng thái</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-64">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-4"
            />
          </div>
        </div>
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
                <>
                  <TableRow
                    onClick={() => {
                      setSelectedContract(row.original);
                    }}
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
                </>
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
      {isExtendListDialogOpen && selectedContract && (
        <ExtendListDialog
          isOpen={isExtendListDialogOpen}
          onClose={hendleExtendListDialogClose}
          contractId={selectedContract.contractId}
          contractStatus={selectedContract.status}
        />
      )}
    </div>
  );
};

export default CustomerContractList;
