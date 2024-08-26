"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import React, { Suspense, lazy } from "react";

// Lazy load components
const ContractDetailsDialog = lazy(
  () =>
    import("@/components/dashboard/customer-contracts/ContractDetailsDialog")
);
const BookingRequestList = lazy(
  () =>
    import("@/components/dashboard/lists/booking-request/BookingRequestList")
);
const RegistrationList = lazy(
  () =>
    import("@/components/dashboard/lists/visit-request/VisitRegistrationList")
);
const ServicesList = lazy(
  () => import("@/components/dashboard/services/ServicesSection")
);
const VisitScheduleDialog = lazy(
  () => import("@/components/dashboard/services/VisitScheduleDialog")
);
const CustomerContractList = lazy(
  () => import("@/components/dashboard/customer-contracts/CustomerContractList")
);

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStateContext } from "@/context/StateContext";
import withAuth from "@/components/withAuth";

function Dashboard() {
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

  const handleContainerSelect = useCallback(
    (container: any) => {
      console.log("Selected container: ", container);
      setSelectedContainer(container);
      setIsContainerModalOpen(true);
    },
    [setSelectedContainer, setIsContainerModalOpen]
  );

  const handleVisitScheduleSubmit = useCallback(() => {
    console.log("[Dashboard] Visit schedule submitted");
    setReFetchTrigger((prev) => !prev);
    setIsVisitScheduleModalOpen(false);
    if (user?.customerId) {
      fetchVisitRegistrations(user.customerId);
    }
  }, [
    user?.customerId,
    fetchVisitRegistrations,
    setReFetchTrigger,
    setIsVisitScheduleModalOpen,
  ]);

  useEffect(() => {
    console.log("isContainerModalOpen: ", isContainerModalOpen);
  }, [isContainerModalOpen]);

  return (
    <div className="text-foreground min-h-screen flex flex-col py-20 bg-gradient-to-b from-stone-200 to-stone-700">
      <main className="flex-1 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 pb-4 ">
          <Breadcrumb className="flex-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">
                  Khách hàng
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 gap-8 ">
          <div>
            <ServicesList containers={containers} />
          </div>
          <motion.div
            className=""
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs
              defaultValue="contracts"
              className="w-full flex flex-col items-center"
            >
              <TabsList className="flex-wrap w-fit space-x-0 sm:space-x-4 shadow-lg">
                <TabsTrigger
                  value="contracts"
                  className="px-4 py-2 w-full sm:w-auto rounded-t-md hover:bg-gray-200 transition-all duration-200"
                >
                  Quản lý Hợp đồng
                </TabsTrigger>
                <TabsTrigger
                  value="visitRegistrations"
                  className="px-4 py-2 w-full sm:w-auto rounded-t-md hover:bg-gray-200 transition-all duration-200"
                >
                  Đơn thăm viếng
                </TabsTrigger>
                <TabsTrigger
                  value="bookingRequests"
                  className="px-4 py-2 w-full sm:w-auto rounded-t-md hover:bg-gray-200 transition-all duration-200"
                >
                  Đơn đặt ô chứa
                </TabsTrigger>
              </TabsList>
              <TabsContent value="visitRegistrations" className="w-full">
                <RegistrationList reFetchTrigger={reFetchTrigger} />
              </TabsContent>
              <TabsContent value="bookingRequests" className="w-full">
                <BookingRequestList reFetchTrigger={false} />
              </TabsContent>
              <TabsContent value="contracts" className="w-full">
                <CustomerContractList
                  contracts={contracts}
                  onSelect={handleContainerSelect}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Suspense fallback={<div>Loading...</div>}>
        <ContractDetailsDialog
          isOpen={isContainerModalOpen}
          onClose={() => setIsContainerModalOpen(false)}
          contractId={selectedContainer?.nicheId}
        />
        <VisitScheduleDialog
          isOpen={isVisitScheduleModalOpen}
          onClose={() => setIsVisitScheduleModalOpen(false)}
          onSubmit={handleVisitScheduleSubmit}
        />
      </Suspense>
    </div>
  );
}
export default withAuth(Dashboard);
