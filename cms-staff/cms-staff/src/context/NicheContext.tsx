// NicheContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

interface NicheDtoForStaff {
  nicheId: number;
  nicheName: string;
  customerName?: string;
  deceasedName?: string;
  description?: string;
  status?: string;
}

interface NicheContextType {
  niches: NicheDtoForStaff[];
  setNiches: React.Dispatch<React.SetStateAction<NicheDtoForStaff[]>>;
  fetchNiches: (areaId: number) => void;
}

const NicheContext = createContext<NicheContextType | undefined>(undefined);

export const NicheProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [niches, setNiches] = useState<NicheDtoForStaff[]>([]);

  const fetchNiches = async (areaId: number) => {
    try {
      const response = await axiosInstance.get(
        `/api/StaffNiches/area/${areaId}`
      );
      setNiches(response.data.$values);
    } catch (error) {
      toast.error("Không thể tải danh sách ô chứa");
    }
  };

  return (
    <NicheContext.Provider value={{ niches, setNiches, fetchNiches }}>
      {children}
    </NicheContext.Provider>
  );
};

export const useNiches = () => {
  const context = useContext(NicheContext);
  if (!context) {
    throw new Error("useNiches must be used within a NicheProvider");
  }
  return context;
};
