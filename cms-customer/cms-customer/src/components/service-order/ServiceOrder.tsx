"use client";

import { useState, useMemo } from "react";
import FilterPanel from "./FilterPanel";
import ProductList from "./ProductList";

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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.category)) &&
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
      );
    });
  }, [priceRange, selectedCategories, selectedBrands]);

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8 p-4 md:p-8">
      <FilterPanel
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        products={products}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
}
