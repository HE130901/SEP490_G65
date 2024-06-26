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
    <div className="flex h-auto pt-16 justify-center">
      <div className="flex flex-1 overflow-auto">
        <div className="flex-1">
          <main className="px-4 py-4 bg-stone-100 mx-4 my-4 h-auto rounded-md bg-gradient-to-b from-slate-100 to-stone-400">
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
                  <BreadcrumbPage>Đặt dịch vụ</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <ServiceOrder />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderPage;
