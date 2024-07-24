"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useStateContext } from "@/context/StateContext";
import { useEffect, useRef, useState } from "react";
import VisitRegistrationList from "./ServiceOrderList";
import OrderList from "./ServiceOrderList";

export default function Dashboard() {
  const {
    user,
    niches: setSelectedContainer,
    isContainerModalOpen,
    setIsContainerModalOpen,

    setIsVisitScheduleModalOpen,
    fetchVisitRegistrations,
    fetchContracts,
  } = useStateContext();

  const [reFetchTrigger, setReFetchTrigger] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    console.log("User in Dashboard: ", user);
  }, [user]);

  useEffect(() => {
    if (user?.customerId) {
      console.log(
        "[Dashboard] Fetching contracts for customerId: ",
        user.customerId
      );
      fetchContracts(user.customerId);
    }
  }, [user, fetchContracts]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (user && user.customerId) {
      console.log("[Dashboard] Fetching visit registrations");
      fetchVisitRegistrations(user.customerId);
    }
  }, [user, reFetchTrigger, fetchVisitRegistrations]);

  useEffect(() => {
    console.log("isContainerModalOpen: ", isContainerModalOpen);
  }, [isContainerModalOpen]);

  return (
    <div className="text-foreground min-h-screen flex flex-col py-20 bg-gradient-to-b from-stone-200 to-stone-700">
      <main className="flex-1 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 pb-4 ">
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
                  Danh sách đơn hàng
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <OrderList reFetchTrigger={false} />
        </div>
      </main>
    </div>
  );
}
