"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useStateContext } from "@/context/state-context";
import ContainerList from "@/components/dashboard/ContainerList";
import RegistrationList from "@/components/dashboard/RegistrationList";
import ContainerDetailsDialog from "@/components/dashboard/ContainerDetailsDialog";
import VisitScheduleDialog from "@/components/dashboard/VisitScheduleDialog";
import ServicesList from "@/components/dashboard/ServicesSection";
import axiosInstance from "@/api/axios-config";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ContainerList
              containers={containers}
              onSelect={handleContainerSelect}
            />
          </div>
          <div>
            <ServicesList containers={containers} />
          </div>
        </div>
        <RegistrationList reFetchTrigger={reFetchTrigger} />
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
