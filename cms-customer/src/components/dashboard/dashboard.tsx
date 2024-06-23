"use client";

import { useEffect } from "react";
import { useStateContext } from "@/context/state-context";
import ContainerList from "./ContainerList";
import RegistrationList from "./RegistrationList";
import ContainerDetailsDialog from "./ContainerDetailsDialog";
import VisitScheduleDialog from "./VisitScheduleDialog";
import ContractManagementDialog from "./ContractManagementDialog";
import ServiceOrderDialog from "./ServiceOrderDialog";
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
    isContractManagementModalOpen,
    setIsContractManagementModalOpen,
    isServiceModalOpen,
    setIsServiceModalOpen,
    visitSchedule,
    setVisitSchedule,
    contractExtensions,
    setContractExtensions,
    contractTerminations,
    setContractTerminations,
  } = useStateContext();

  useEffect(() => {
    const fetchContainers = async () => {
      if (!user) {
        console.error("User is not logged in.");
        return;
      }

      try {
        const { customerId } = user;
        const response = await axiosInstance.get(
          `/api/niches/customer/${customerId}`
        );

        if (response.data && Array.isArray(response.data.$values)) {
          setContainers(response.data.$values);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching niches:", error);
      }
    };

    fetchContainers();
  }, [user, setContainers]);

  const handleContainerSelect = (container: any) => {
    setSelectedContainer(container);
    setIsContainerModalOpen(true);
  };

  const handleVisitScheduleSubmit = (data: any) => {
    setVisitSchedule((prev) => [...prev, data]);
    setIsVisitScheduleModalOpen(false);
  };

  const handleContractSubmit = (data: any, action: string) => {
    if (action === "extend") {
      setContractExtensions((prev) => [...prev, data]);
    } else {
      setContractTerminations((prev) => [...prev, data]);
    }
    setIsContractManagementModalOpen(false);
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ContainerList
            containers={containers}
            onSelect={handleContainerSelect}
            onVisitSchedule={() => setIsVisitScheduleModalOpen(true)}
            onServiceOrder={() => setIsServiceModalOpen(true)}
          />
          <RegistrationList
            registrations={[
              ...(visitSchedule || []),
              ...(contractExtensions || []),
              ...(contractTerminations || []),
            ]}
            onEdit={(index, data) => {
              // handle edit
            }}
            onDelete={(index) => {
              // handle delete
            }}
          />
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
      <ContractManagementDialog
        isOpen={isContractManagementModalOpen}
        onClose={() => setIsContractManagementModalOpen(false)}
        onSubmit={(data) =>
          handleContractSubmit(data, selectedContainer?.action)
        }
        container={selectedContainer}
        action={selectedContainer?.action}
      />
      <ServiceOrderDialog
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
      />
    </div>
  );
}
