//src/app/dashboard/niche-reservation/page.tsx
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
import Information from "@/components/niche-reservation/Information";
import NicheReservation from "@/components/niche-reservation/NicheReservation";
import Card from "@/components/test/card";

const NicheReservationPage = () => {
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
          <div className=" py-4 bg-stone-100 mx-4 my-4 h-auto rounded-md">
            <Breadcrumb className="pl-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dịch vụ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Đặt ô chứa</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Information />
            <NicheReservation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicheReservationPage;
