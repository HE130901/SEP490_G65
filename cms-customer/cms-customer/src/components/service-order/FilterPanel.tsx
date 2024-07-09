"use client";

import { useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterPanelProps {
  priceRange: [number, number];

  setPriceRange: (range: [number, number]) => void;

  selectedCategories: string[];

  setSelectedCategories: (categories: string[]) => void;

  selectedBrands: string[];

  setSelectedBrands: (brands: string[]) => void;

  products: any[];
}

export default function FilterPanel({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  products,
}: FilterPanelProps) {
  const categoryCount = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0;
      }
      acc[product.category]++;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const brandCount = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!acc[product.tag]) {
        acc[product.tag] = 0;
      }
      acc[product.tag]++;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6 self-start">
      <h2 className="text-lg font-semibold mb-4">Bộ Lọc</h2>
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-2">Khoảng giá</h3>
        <Slider
          value={priceRange}
          onValueChange={(values) => {
            setPriceRange([Math.min(...values), Math.max(...values)]);
          }}
          min={0}
          max={1000000}
          step={10000}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 pt-2">
          <span>{priceRange[0].toLocaleString()} ₫</span>
          <span>{priceRange[1].toLocaleString()} ₫</span>
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
                  const newCategories = selectedCategories.includes(category)
                    ? selectedCategories.filter((c: string) => c !== category)
                    : [...selectedCategories, category];
                  setSelectedCategories(newCategories);
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
            <Label key={brand} className="flex items-center gap-2 font-normal">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => {
                  const newBrands = selectedBrands.includes(brand)
                    ? selectedBrands.filter((b: string) => b !== brand)
                    : [...selectedBrands, brand];
                  setSelectedBrands(newBrands);
                }}
              />
              {brand} ({brandCount[brand]})
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
}
