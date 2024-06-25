"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import ServicesList from "@/components/services/service";

const ServicesPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex h-auto pt-16">
      <div className="flex flex-1 overflow-auto">
        <div className="flex-1">
          <div className="px-4 py-4 bg-stone-100 mx-4 my-4 h-auto rounded-md">
            <Breadcrumb className="">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dịch vụ</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <ServicesList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
