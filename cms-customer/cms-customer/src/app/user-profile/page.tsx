"use client";

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
import UserProfileSetting from "@/components/user-profile/UserProfileSetting";

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
          <main className="px-4 py-4 bg-stone-100 mx-4 my-4 h-auto rounded-md">
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
                  <BreadcrumbPage>Thông tin tài khoản</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <UserProfileSetting />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderPage;
