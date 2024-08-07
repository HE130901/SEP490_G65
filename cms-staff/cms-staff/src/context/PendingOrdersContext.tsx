import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

interface PendingOrderSummary {
  type: string;
  count: number;
}

interface PendingOrdersContextType {
  pendingOrdersSummary: PendingOrderSummary[];
  loading: boolean;
  fetchPending: () => void;
}

const PendingOrdersContext = createContext<
  PendingOrdersContextType | undefined
>(undefined);

export const PendingOrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pendingOrdersSummary, setPendingOrdersSummary] = useState<
    PendingOrderSummary[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const ordersResponse = await axiosInstance.get("/api/Orders/pending");
      if (ordersResponse.data && ordersResponse.data.$values) {
        setPendingOrdersSummary(ordersResponse.data.$values);
      } else {
        console.error("Unexpected API response structure:", ordersResponse);
      }
    } catch (error) {
      console.error("Error fetching pending orders summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    const intervalId = setInterval(fetchPending, 30000); // 30 giây

    return () => clearInterval(intervalId); // Clear interval khi component unmount
  }, []);

  return (
    <PendingOrdersContext.Provider
      value={{ pendingOrdersSummary, loading, fetchPending }}
    >
      {children}
    </PendingOrdersContext.Provider>
  );
};

export const usePendingOrdersContext = () => {
  const context = useContext(PendingOrdersContext);
  if (!context) {
    throw new Error(
      "usePendingOrdersContext must be used within a PendingOrdersProvider"
    );
  }
  return context;
};
