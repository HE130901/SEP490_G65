"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatVND } from "@/utils/formatCurrency";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const products = [
  {
    id: 1,
    name: "Combo Hoa Quả",
    price: 299900,
    category: "Đồ cúng viếng",
    brand: "Hoa quả",
    image: "/images/product1.png",
  },
  {
    id: 2,
    name: "Tiền Vàng",
    price: 499900,
    category: "Đồ cúng viếng",
    brand: "Vàng mã",
    image: "/images/product2.png",
  },
  {
    id: 3,
    name: "Rượu Lễ",
    price: 799900,
    category: "Đồ cúng viếng",
    brand: "Rượu, nước",
    image: "/images/product3.png",
  },
  {
    id: 4,
    name: "Xôi Lễ",
    price: 599900,
    category: "Đồ cúng viếng",
    brand: "Đồ ăn",
    image: "/images/product4.png",
  },
  {
    id: 5,
    name: "Hoa Lễ",
    price: 249900,
    category: "Đồ cúng viếng",
    brand: "Hoa quả",
    image: "/images/product1.png",
  },
  {
    id: 6,
    name: "Trái Cây",
    price: 599900,
    category: "Đồ cúng viếng",
    brand: "Hoa quả",
    image: "/images/product2.png",
  },
  {
    id: 7,
    name: "Bánh Kẹo",
    price: 399900,
    category: "Đồ cúng viếng",
    brand: "Đồ ăn",
    image: "/images/product3.png",
  },
  {
    id: 8,
    name: "Combo Đầy Đủ",
    price: 699900,
    category: "Đồ cúng viếng",
    brand: "Combo",
    image: "/images/product4.png",
  },
  {
    id: 9,
    name: "Combo dọn dẹp, lau chùi",
    price: 699900,
    category: "Dịch vụ",
    brand: "Combo",
    image: "/images/product1.png",
  },
  {
    id: 10,
    name: "Dịch vụ thắp hương hộ",
    price: 699900,
    category: "Dịch vụ",
    brand: "Combo",
    image: "/images/product2.png",
  },
];

export default function ServiceOrder() {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        return (
          product.price >= priceRange[0] &&
          product.price <= priceRange[1] &&
          (selectedCategories.length === 0 ||
            selectedCategories.includes(product.category)) &&
          (selectedBrands.length === 0 ||
            selectedBrands.includes(product.brand))
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [priceRange, selectedCategories, selectedBrands, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const categoryCount = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0;
      }
      acc[product.category]++;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const brandCount = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!acc[product.brand]) {
        acc[product.brand] = 0;
      }
      acc[product.brand]++;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8 p-4 md:p-8">
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 self-start">
        <h2 className="text-lg font-semibold mb-4">Bộ Lọc</h2>
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2">Khoảng giá</h3>
          <Slider
            value={priceRange}
            onValueChange={(values) =>
              setPriceRange([Math.min(...values), Math.max(...values)])
            }
            min={0}
            max={1000000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 pt-2">
            <span>{formatVND(priceRange[0])}</span>
            <span>{formatVND(priceRange[1])}</span>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2">Phân loại</h3>
          <div className="grid gap-2">
            {Object.keys(categoryCount).map((category) => (
              <Label
                key={category}
                className="flex items-center gap-2 font-normal"
              >
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    );
                  }}
                />
                {category} ({categoryCount[category]})
              </Label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-2">Danh mục</h3>
          <div className="grid gap-2">
            {Object.keys(brandCount).map((brand) => (
              <Label
                key={brand}
                className="flex items-center gap-2 font-normal"
              >
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => {
                    setSelectedBrands((prev) =>
                      prev.includes(brand)
                        ? prev.filter((b) => b !== brand)
                        : [...prev, brand]
                    );
                  }}
                />
                {brand} ({brandCount[brand]})
              </Label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  <ListOrderedIcon className="w-4 h-4 mr-2" />
                  Sắp xếp: {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]" align="end">
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <DropdownMenuRadioItem value="relevance">
                    Mức độ liên quan
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-asc">
                    Giá: Từ thấp đến cao
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-desc">
                    Giá: Từ cao đến thấp
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={viewMode === "grid" ? "outline" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGridIcon className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "outline" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div
          className={`grid ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          } gap-6`}
        >
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden ${
                  viewMode === "list" ? "flex items-center gap-4" : ""
                }`}
              >
                <Link href="#" className="block" prefetch={false}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className={`w-full ${
                      viewMode === "list"
                        ? "h-24 object-cover"
                        : "h-60 object-cover"
                    }`}
                  />
                </Link>
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {formatVND(product.price)}
                    </span>
                    <Button size="sm">Thêm vào giỏ</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm</p>
          )}
        </div>
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => prev - 1);
                  }}
                />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => prev + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function LayoutGridIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function ListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function ListOrderedIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}
