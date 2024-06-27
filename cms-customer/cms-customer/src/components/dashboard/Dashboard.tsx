"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStateContext } from "@/context/state-context";
import ContainerList from "@/components/dashboard/CustomerContractList";
import RegistrationList from "@/components/dashboard/VisitRegistrationList";
import ContractRenewalList from "@/components/dashboard/ContractRenewalList";
import ServiceRequestList from "@/components/dashboard/ServiceRequestList";
import BookingRequestList from "@/components/dashboard/BookingRequestList";
import ContainerDetailsDialog from "@/components/dashboard/ContainerDetailsDialog";
import VisitScheduleDialog from "@/components/dashboard/VisitScheduleDialog";
import ServicesList from "@/components/dashboard/ServicesSection";
import axiosInstance from "@/utils/axiosInstance";
import { motion } from "framer-motion";

export default function Dashboard() {
  const {
    user,
    niches: containers,
    setNiches: setContainers,
    selectedContainer,
    setSelectedContainer,
    isContainerModalOpen,
    setIsContainerModalOpen,
    isVisitScheduleModalOpen,
    setIsVisitScheduleModalOpen,
    fetchVisitRegistrations,
  } = useStateContext();

  const [reFetchTrigger, setReFetchTrigger] = useState(false);
  const isMounted = useRef(false);

  const fetchContainers = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axiosInstance.get(
        `/api/niches/customer/${user.customerId}`
      );

      if (response.data && Array.isArray(response.data.$values)) {
        setContainers(response.data.$values);
      } else {
        console.error("[Dashboard] Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("[Dashboard] Error fetching niches:", error);
    }
  }, [user, setContainers]);

  useEffect(() => {
    if (user) {
      fetchContainers();
    }
  }, [user, fetchContainers]);

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

  return (
    <div className="text-foreground min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <div className="">
            <ContainerList
              containers={containers}
              onSelect={handleContainerSelect}
            />
          </div>
          <div>
            <ServicesList containers={containers} />
          </div>
        </div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs
            defaultValue="visitRegistrations"
            className="w-full flex flex-col items-center"
          >
            <TabsList className="mb-4 space-x-4 shadow-lg">
              <TabsTrigger
                value="visitRegistrations"
                className="px-4 py-2 rounded-t-md hover:bg-gray-200 transition-all duration-200"
              >
                Đơn đăng ký viếng
              </TabsTrigger>
              <TabsTrigger
                value="contractRenewals"
                className="px-4 py-2 rounded-t-md hover:bg-gray-200 transition-all duration-200"
              >
                Đơn đăng ký gia hạn hợp đồng
              </TabsTrigger>
              <TabsTrigger
                value="serviceRequests"
                className="px-4 py-2 rounded-t-md hover:bg-gray-200 transition-all duration-200"
              >
                Đơn đăng ký sử dụng dịch vụ
              </TabsTrigger>
              <TabsTrigger
                value="bookingRequests"
                className="px-4 py-2 rounded-t-md hover:bg-gray-200 transition-all duration-200"
              >
                Đơn đăng ký đặt chỗ
              </TabsTrigger>
            </TabsList>
            <TabsContent value="visitRegistrations" className="w-full">
              <RegistrationList reFetchTrigger={reFetchTrigger} />
            </TabsContent>
            <TabsContent value="contractRenewals" className="w-full">
              <ContractRenewalList />
            </TabsContent>
            <TabsContent value="serviceRequests" className="w-full">
              <ServiceRequestList />
            </TabsContent>
            <TabsContent value="bookingRequests" className="w-full">
              <BookingRequestList />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <ContainerDetailsDialog
        isOpen={isContainerModalOpen}
        onClose={() => setIsContainerModalOpen(false)}
        containerId={selectedContainer?.nicheId}
      />
      <VisitScheduleDialog
        isOpen={isVisitScheduleModalOpen}
        onClose={() => setIsVisitScheduleModalOpen(false)}
        onSubmit={handleVisitScheduleSubmit}
        containers={containers}
      />
    </div>
  );
}
