"use client";
// src/app/service-order/page.tsx

import React from "react";
import withAuth from "@/components/withAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import ServiceOrder from "@/components/service-order/ServiceOrder";

const ServiceOrderPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="text-foreground min-h-screen flex flex-col py-20 bg-gradient-to-b from-stone-200 to-stone-700">
      <main className="flex-1 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 pb-4">
          <Breadcrumb className="">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Khách hàng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">
                  Sản phẩm & Dịch vụ
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ServiceOrder />
      </main>
    </div>
  );
};

export default ServiceOrderPage;
