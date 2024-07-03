"use client";

import { useState, useMemo, useEffect } from "react";
import FilterPanel from "./FilterPanel";
import ProductList from "./ProductList";
import ServiceAPI from "@/services/serviceService";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ServiceOrder() {
  const [services, setServices] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceAPI.getAllServices();
        setServices(response.data.$values);
      } catch (error) {
        toast.error("Failed to fetch services. Please try again later.");
      }
    };

    fetchServices();
  }, []);

  const filteredProducts = useMemo(() => {
    return services.filter((service) => {
      return (
        service.price >= priceRange[0] &&
        service.price <= priceRange[1] &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(service.category)) &&
        (selectedBrands.length === 0 || selectedBrands.includes(service.tag))
      );
    });
  }, [priceRange, selectedCategories, selectedBrands, services]);

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8 ">
      <FilterPanel
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        products={services}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
}
