"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/formatCurrency";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import PaginationControls from "./PaginationControls";
import { CartButton } from "./CartButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface ProductListProps {
  products: any[];
}

export default function ProductList({ products }: ProductListProps) {
  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("Mặc định");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8;

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "Tăng dần":
          return a.price - b.price;
        case "Giảm dần":
          return b.price - a.price;
        default:
          return 0;
      }
    });
    return sorted;
  }, [sortBy, products]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleAddToCart = (product: any, event: any, fromModal = false) => {
    const item = {
      id: product.serviceId,
      name: product.serviceName,
      price: product.price,
      image: product.servicePicture.startsWith("http")
        ? product.servicePicture
        : "default-image-url",
      quantity: 1,
    };
    addToCart(item);
    setAddedProductId(product.serviceId);
    toast.success(`${product.serviceName} đã được thêm vào giỏ hàng`);

    const imgToFly = fromModal
      ? document.querySelector(".product-card img")
      : event.target.closest(".product-card").querySelector("img");

    if (imgToFly) {
      const imgClone = imgToFly.cloneNode(true);
      const cartIcon = cartIconRef.current;

      if (cartIcon) {
        imgClone.style.position = "absolute";
        imgClone.style.zIndex = "999";
        imgClone.style.top = `${imgToFly.getBoundingClientRect().top}px`;
        imgClone.style.left = `${imgToFly.getBoundingClientRect().left}px`;
        imgClone.style.width = `${imgToFly.getBoundingClientRect().width}px`;
        imgClone.style.height = `${imgToFly.getBoundingClientRect().height}px`;
        document.body.appendChild(imgClone);

        const moveToCart = () => {
          imgClone.style.transition = "all 1s ease";
          imgClone.style.top = `${
            cartIcon.getBoundingClientRect().top + window.scrollY
          }px`;
          imgClone.style.left = `${
            cartIcon.getBoundingClientRect().left + window.scrollX
          }px`;
          imgClone.style.width = "20px";
          imgClone.style.height = "20px";
          imgClone.style.opacity = "0";
        };

        requestAnimationFrame(moveToCart);

        setTimeout(() => {
          imgClone.remove();
        }, 1000);

        setTimeout(() => {
          setAddedProductId(null);
        }, 1000);
      } else {
        console.error("Cart icon reference is null.");
        toast.error("Không thể thêm sản phẩm vào giỏ hàng.");
      }
    }
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <Toaster />
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
                onValueChange={(value) => setSortBy(value)}
              >
                <DropdownMenuRadioItem value="Mặc định">
                  Mặc định
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Tăng dần">
                  Giá: Từ thấp đến cao
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Giảm dần">
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
        <CartButton ref={cartIconRef} />
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
            <TooltipProvider key={product.serviceId}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`product-card bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden transition-transform transform hover:scale-105 ${
                      viewMode === "list" ? "flex items-center gap-4" : ""
                    }`}
                  >
                    <Link href="#" className="block" prefetch={false}>
                      <Image
                        src={
                          product.servicePicture.startsWith("http")
                            ? product.servicePicture
                            : "/default-image-url.jpg"
                        }
                        alt={product.serviceName}
                        width={160}
                        height={120}
                        className={`w-full ${
                          viewMode === "list"
                            ? "h-24 object-cover"
                            : "h-60 object-cover"
                        }`}
                        onClick={() => handleViewDetails(product)}
                      />
                    </Link>
                    <div className="p-4 flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {product.serviceName}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {formatVND(product.price)}
                        </span>
                        <Button
                          size="sm"
                          onClick={(event) =>
                            handleAddToCart(product, event, false)
                          }
                          className={`${
                            addedProductId === product.serviceId
                              ? "animate-bounce"
                              : ""
                          }`}
                        >
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-orange-500 font-bold text-white">
                  {product.serviceName}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        ) : (
          <p>Không tìm thấy sản phẩm</p>
        )}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {selectedProduct && (
        <Dialog
          open={selectedProduct !== null}
          onOpenChange={handleCloseDetails}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.serviceName}</DialogTitle>
              <DialogDescription>{selectedProduct.category}</DialogDescription>
            </DialogHeader>
            <Image
              src={
                selectedProduct.servicePicture.startsWith("http")
                  ? selectedProduct.servicePicture
                  : "/default-image-url.jpg"
              }
              alt={selectedProduct.serviceName}
              width={160}
              height={120}
              className="w-full h-auto object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700">{selectedProduct.description}</p>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              {formatVND(selectedProduct.price)}
            </p>
            <Button
              className="mt-4"
              onClick={(event) => handleAddToCart(selectedProduct, event, true)}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="outline"
              className="mt-2"
              onClick={handleCloseDetails}
            >
              Đóng
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function LayoutGridIcon(props: React.SVGProps<SVGSVGElement>) {
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

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
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

function ListOrderedIcon(props: React.SVGProps<SVGSVGElement>) {
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
