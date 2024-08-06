// DashboardContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "@/utils/axiosInstance";

interface NicheArea {
  areaAddress: string;
  areaId: number;
  count: number;
  occupied: number;
  reserved: number;
  available: number;
  unavailable: number;
}

interface NicheReportData {
  availableNiches: number;
  reservedNiches: number;
  occupiedNiches: number;
  unavailableNiches: number;
  totalNiches: number;
  nichesByArea: NicheArea[];
}

interface ServiceOverviewDTO {
  totalServices: number;
  totalRevenue: number;
  averageOrderValue: number;
  servicesByCategory: Record<string, number>;
  revenueByCategory: Record<string, number>;
  servicesByStatus: Record<string, number>;
}

interface ContractStatus {
  status: string;
  count: number;
  totalAmount: number;
}

interface ReportData {
  totalContracts: number;
  activeContracts: number;
  totalRevenue: number;
  averageContractValue: number;
  contractsByStatus: {
    $values: ContractStatus[];
  };
}

interface PendingOrderSummary {
  type: string;
  count: number;
}

interface DashboardContextProps {
  nicheReport: NicheReportData | null;
  serviceReport: ServiceOverviewDTO | null;
  contractReport: ReportData | null;
  pendingOrdersSummary: PendingOrderSummary[] | null;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [nicheReport, setNicheReport] = useState<NicheReportData | null>(null);
  const [serviceReport, setServiceReport] = useState<ServiceOverviewDTO | null>(
    null
  );
  const [contractReport, setContractReport] = useState<ReportData | null>(null);
  const [pendingOrdersSummary, setPendingOrdersSummary] = useState<
    PendingOrderSummary[] | null
  >(null);

  const fetchData = async () => {
    try {
      const nicheResponse = await axiosInstance.get(
        "/api/Report/niche-summary"
      );
      if (
        nicheResponse.data &&
        nicheResponse.data.nichesByArea &&
        nicheResponse.data.nichesByArea.$values
      ) {
        setNicheReport({
          ...nicheResponse.data,
          nichesByArea: nicheResponse.data.nichesByArea.$values,
        });
      } else {
        console.error("Unexpected API response structure:", nicheResponse);
      }

      const serviceResponse = await axiosInstance.get(
        "/api/Report/services-summary"
      );
      setServiceReport(serviceResponse.data);

      const contractResponse = await axiosInstance.get(
        "/api/Report/contract-summary"
      );
      setContractReport(contractResponse.data);

      const ordersResponse = await axiosInstance.get("/api/Orders/pending");
      if (ordersResponse.data && ordersResponse.data.$values) {
        setPendingOrdersSummary(ordersResponse.data.$values);
      } else {
        console.error("Unexpected API response structure:", ordersResponse);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Fetch data every 30 seconds
    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        nicheReport,
        serviceReport,
        contractReport,
        pendingOrdersSummary,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
