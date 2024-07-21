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
    niches: containers,
    selectedContainer,
    setSelectedContainer,
    isContainerModalOpen,
    setIsContainerModalOpen,
    isVisitScheduleModalOpen,
    setIsVisitScheduleModalOpen,
    fetchVisitRegistrations,
    fetchContracts,
    contracts,
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

  const handleContainerSelect = (container: any) => {
    console.log("Selected container: ", container);
    setSelectedContainer(container);
    setIsContainerModalOpen(true);
  };

  const handleVisitScheduleSubmit = () => {
    console.log("[Dashboard] Visit schedule submitted");
    setReFetchTrigger((prev) => !prev);
    setIsVisitScheduleModalOpen(false);
    if (user && user.customerId) {
      fetchVisitRegistrations(user.customerId);
    }
  };

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
