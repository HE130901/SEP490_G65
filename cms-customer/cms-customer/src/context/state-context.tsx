"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import AuthAPI from "@/api/authApi";
import BuildingAPI from "@/api/buildingApi";
import NicheAPI from "@/api/nicheApi";
import NicheReservationAPI from "@/api/nicheReservationApi";
import VisitRegistrationAPI from "@/api/visitRegistrationApi";
import { useRouter } from "next/navigation";
import { toast as sonnerToast } from "sonner";

const StateContext = createContext<any | null>(null);

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<any | null>(null);
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<any | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<any | null>(null);
  const [isContainerModalOpen, setIsContainerModalOpen] = useState(false);
  const [isVisitScheduleModalOpen, setIsVisitScheduleModalOpen] =
    useState(false);
  const [isContractManagementModalOpen, setIsContractManagementModalOpen] =
    useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [niches, setNiches] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [visitRegistrations, setVisitRegistrations] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await AuthAPI.getCurrentUser(token);
      const { customerId, fullName, citizenId, role, email, phone, address } =
        response.data;

      setUser({
        customerId: String(customerId),
        fullName: String(fullName),
        citizenId: String(citizenId),
        role: String(role),
        email: String(email),
        phone: String(phone),
        address: String(address),
        token,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthAPI.login(email, password);
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      await fetchCurrentUser(token);
      router.push("/dashboard");
      sonnerToast.success("Đăng nhập thành công!");
    } catch (error) {
      sonnerToast.error("Đăng nhập thất bại. Vui lòng thử lại sau.");
    }
  };

  const register = async (formData: any) => {
    try {
      await AuthAPI.register(formData);
      router.push("/auth/login");
      sonnerToast.success("Registration successful.");
    } catch (error) {
      sonnerToast.error("Registration failed. Please try again later.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const fetchBuildingsData = useCallback(async () => {
    try {
      const response = await BuildingAPI.getAllData();
      setBuildings(response.data.buildings.$values);
    } catch (error) {
      console.error(
        "[StateProvider] Error fetching buildings, floors, and areas:",
        error
      );
    }
  }, []);

  const fetchNiches = useCallback(
    async (buildingId: number, floorId: number, areaId: number) => {
      try {
        const response = await NicheAPI.getAll(buildingId, floorId, areaId);
        setNiches(response.data.$values);
      } catch (error) {
        console.error("[StateProvider] Error fetching niches:", error);
      }
    },
    []
  );

  const fetchReservations = async (customerId: number) => {
    try {
      const response = await NicheReservationAPI.getByCustomerId(customerId);
      setReservations(response.data.$values);
    } catch (error) {
      console.error("[StateProvider] Error fetching reservations:", error);
    }
  };

  const deleteReservation = async (reservationId: number) => {
    try {
      await NicheReservationAPI.delete(reservationId);
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.reservationId !== reservationId
        )
      );
      sonnerToast.success("Reservation deleted successfully!");
    } catch (error) {
      sonnerToast.error("Failed to delete the reservation.");
    }
  };

  const fetchVisitRegistrations = useCallback(async (customerId: number) => {
    try {
      const response = await VisitRegistrationAPI.getByCustomerId(customerId);
      setVisitRegistrations(response.data.$values);
      console.log("[useStateContext] Fetching visit registrations");
    } catch (error) {
      console.error(
        "[StateProvider] Error fetching visit registrations:",
        error
      );
    }
  }, []);

  const deleteVisitRegistration = async (visitId: number) => {
    try {
      await VisitRegistrationAPI.delete(visitId);
      setVisitRegistrations((prevRegistrations) =>
        prevRegistrations.filter(
          (registration) => registration.visitId !== visitId
        )
      );
      sonnerToast.success("Visit registration deleted successfully!");
    } catch (error) {
      sonnerToast.error("Failed to delete the visit registration.");
    }
  };

  const resetSelections = () => {
    setSelectedFloor(null);
    setSelectedArea(null);
    setSelectedNiche(null);
  };

  const resetSectionAndNiche = () => {
    setSelectedArea(null);
    setSelectedNiche(null);
  };

  const resetNiche = () => {
    setSelectedNiche(null);
  };

  useEffect(() => {
    if (isMounted.current) {
      fetchBuildingsData();
    } else {
      isMounted.current = true;
    }
  }, [fetchBuildingsData]);

  return (
    <StateContext.Provider
      value={{
        selectedBuilding,
        setSelectedBuilding,
        selectedFloor,
        setSelectedFloor,
        selectedArea,
        setSelectedArea,
        selectedNiche,
        setSelectedNiche,
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
        buildings,
        setBuildings,
        niches,
        setNiches,
        reservations,
        setReservations,
        visitRegistrations,
        setVisitRegistrations,
        fetchBuildingsData,
        fetchNiches,
        fetchReservations,
        deleteReservation,
        fetchVisitRegistrations,
        deleteVisitRegistration,
        resetSelections,
        resetSectionAndNiche,
        resetNiche,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
