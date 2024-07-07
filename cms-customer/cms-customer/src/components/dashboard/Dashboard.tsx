"use client";

import ContainerDetailsDialog from "@/components/dashboard/customer-contracts/ContractDetailsDialog";
import CustomerContractList from "@/components/dashboard/customer-contracts/CustomerContractList";
import BookingRequestList from "@/components/dashboard/lists/booking-request/BookingRequestList";
import ServiceRequestList from "@/components/dashboard/lists/service-request/ServiceRequestList";
import RegistrationList from "@/components/dashboard/lists/visit-request/VisitRegistrationList";
import ServicesList from "@/components/dashboard/services/ServicesSection";
import VisitScheduleDialog from "@/components/dashboard/services/VisitScheduleDialog";
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
import NicheAPI from "@/services/nicheService";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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
      const response = await NicheAPI.getAllByCustomer(user.customerId);

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
      <main className="flex-1 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 pb-4 ">
          <Breadcrumb className="flex-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Khách hàng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 gap-8 ">
          <div>
            <ServicesList containers={containers} />
          </div>
          <div className="">
            <CustomerContractList
              containers={containers}
              onSelect={handleContainerSelect}
            />
          </div>
          <motion.div
            className=""
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs
              defaultValue="visitRegistrations"
              className="w-full flex flex-col items-center"
            >
              <TabsList className="flex-wrap w-fit space-x-0 sm:space-x-4 shadow-lg">
                <TabsTrigger
                  value="visitRegistrations"
                  className="px-4 py-2 w-full sm:w-auto rounded-t-md hover:bg-gray-200 transition-all duration-200"
                >
                  Đơn đăng ký viếng
                </TabsTrigger>

                <TabsTrigger
                  value="serviceRequests"
                  className="px-4 py-2 w-full sm:w-auto rounded-t-md hover:bg-gray-200 transition-all duration-200"
                >
                  Đơn đăng ký sử dụng dịch vụ
                </TabsTrigger>
                <TabsTrigger
                  value="bookingRequests"
                  className="px-4 py-2 w-full sm:w-auto rounded-t-md hover:bg-gray-200 transition-all duration-200"
                >
                  Đơn đăng ký đặt chỗ
                </TabsTrigger>
              </TabsList>
              <TabsContent value="visitRegistrations" className="w-full">
                <RegistrationList reFetchTrigger={reFetchTrigger} />
              </TabsContent>
              <TabsContent value="serviceRequests" className="w-full">
                <ServiceRequestList reFetchTrigger={false} />
              </TabsContent>
              <TabsContent value="bookingRequests" className="w-full">
                <BookingRequestList reFetchTrigger={false} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
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
