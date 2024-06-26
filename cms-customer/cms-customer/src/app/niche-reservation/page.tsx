// src/app/dashboard/niche-reservation/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import styles from "./NicheReservationPage.module.css";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={`${styles.content} flex h-auto pt-16 justify-center`}>
        <div className="flex flex-1 overflow-auto">
          <div className="flex-1">
            <div className="py-4  mx-4 my-4 h-auto rounded-md pt-12 bg-gradient-to-b from-slate-100 to-stone-400">
              <Breadcrumb className="ml-36  ">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-black">
                      Trang chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-black" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" className="text-black">
                      Dịch vụ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-black" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-black font-semibold">
                      Đặt ô chứa
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <Information />
              <NicheReservation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NicheReservationPage;
