"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/formatCurrency";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ViewHeadlineOutlinedIcon from "@mui/icons-material/ViewHeadlineOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartRounded";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button as MUIButton,
  Typography,
} from "@mui/material";

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
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
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
    handleCloseDetails();

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <SortOutlinedIcon className="w-4 h-4 mr-2" />
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
            <GridViewOutlinedIcon className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "outline" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <ViewHeadlineOutlinedIcon className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex space-x-4">
          <CartButton ref={cartIconRef} />
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
                          onMouseEnter={() =>
                            setHoveredProductId(product.serviceId)
                          }
                          onMouseLeave={() => setHoveredProductId(null)}
                          className={`button-transition transition-all duration-300 ${
                            addedProductId === product.serviceId
                              ? "animate-bounce"
                              : ""
                          } ${
                            hoveredProductId === product.serviceId
                              ? "button-expanded"
                              : "button-collapsed"
                          }`}
                        >
                          <AddShoppingCartOutlinedIcon />
                          <span
                            className={`${
                              hoveredProductId === product.serviceId
                                ? "inline"
                                : "hidden"
                            }`}
                          >
                            {" "}
                            Thêm vào giỏ
                          </span>
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
          maxWidth="xs"
          open={!!selectedProduct}
          onClose={handleCloseDetails}
        >
          <DialogTitle>{selectedProduct?.serviceName}</DialogTitle>
          <DialogContent>
            <Image
              src={
                selectedProduct?.servicePicture.startsWith("http")
                  ? selectedProduct.servicePicture
                  : "/default-image-url.jpg"
              }
              alt={selectedProduct?.serviceName}
              width={160}
              height={160}
              className="object-cover rounded-lg mb-4 w-80 h-80 justify-center mx-auto"
            />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {selectedProduct?.description}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="textPrimary"
              gutterBottom
            >
              {formatVND(selectedProduct?.price)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <MUIButton variant="outlined" onClick={handleCloseDetails}>
              Đóng
            </MUIButton>
            <MUIButton
              variant="contained"
              color="warning"
              onClick={(event) => handleAddToCart(selectedProduct, event, true)}
            >
              Thêm vào giỏ hàng
            </MUIButton>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
