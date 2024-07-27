"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import AuthAPI from "@/services/authService";
import BuildingAPI from "@/services/buildingService";
import NicheAPI from "@/services/nicheService";
import NicheReservationAPI from "@/services/nicheReservationService";
import VisitRegistrationAPI from "@/services/visitService";
import ContractAPI from "@/services/contractService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceOrderAPI from "@/services/serviceOrderService";

const StateContext = createContext<any | null>(null);

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<any[]>([]);
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
  const [contracts, setContracts] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [nicheReservations, setNicheReservations] = useState<any[]>([]);

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
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại sau.");
    }
  };

  const register = async (formData: any) => {
    try {
      await AuthAPI.register(formData);
      router.push("/auth/login");
      toast.success("Registration successful.");
    } catch (error) {
      toast.error("Registration failed. Please try again later.");
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
        const response = await NicheAPI.getAll(
          String(buildingId),
          String(floorId),
          String(areaId)
        );
        console.log("Niches from API:", response.data);
        setNiches(response.data.$values);
      } catch (error) {
        console.error("[StateProvider] Error fetching niches:", error);
      }
    },
    []
  );

  const fetchNichesForCustomer = useCallback(
    async (buildingId: any, floorId: any, areaId: any) => {
      try {
        const response = await NicheAPI.getAllNicheForCustomer(
          String(buildingId),
          String(floorId),
          String(areaId)
        );
        console.log("Niches for customer from API:", response.data);
        setNiches(response.data.$values);
      } catch (error) {
        console.error(
          "[StateProvider] Error fetching niches for customer:",
          error
        );
      }
    },
    []
  );

  const fetchReservations = async (phoneNumber: string) => {
    try {
      const response = await NicheReservationAPI.getByPhoneNumber(phoneNumber);
      setReservations(response.data.$values);
    } catch (error) {
      console.error("[StateProvider] Error fetching reservations:", error);
    }
  };

  const createReservation = async (data: any) => {
    try {
      const response = await NicheReservationAPI.createReservation(data);
      setReservations((prevReservations) => [
        ...prevReservations,
        response.data,
      ]);
      toast.success("Đặt ô chứa thành công!");
    } catch (error) {
      toast.error("Đặt ô chứa thất bại!");
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
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const fetchVisitRegistrations = useCallback(async () => {
    if (user?.customerId) {
      try {
        const response = await VisitRegistrationAPI.getByCustomerId(
          user.customerId
        );
        setVisitRegistrations(response.data.$values);
        console.log("[useStateContext] Fetching visit registrations");
      } catch (error) {
        console.error(
          "[StateProvider] Error fetching visit registrations:",
          error
        );
      }
    }
  }, [user?.customerId]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await ServiceOrderAPI.getAllByCustomer();
      setOrders(response.data.$values);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      toast.success("Xóa thành công!");
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const fetchContracts = useCallback(async () => {
    if (user?.customerId) {
      try {
        const response = await ContractAPI.getContractsByCustomer(
          user.customerId
        );
        setContracts(response.data.$values);
        console.log(
          "[useStateContext] Fetching contracts: ",
          response.data.$values
        );
      } catch (error) {
        console.error("[StateProvider] Error fetching contracts:", error);
      }
    }
  }, [user?.customerId]);

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

  useEffect(() => {
    if (user?.customerId) {
      console.log("[StateContext] User customerId: ", user.customerId);
      fetchContracts();
      fetchOrders();
    }
  }, [user?.customerId, fetchContracts, fetchOrders]);

  const fetchNicheReservations = useCallback(async (phoneNumber: string) => {
    try {
      const response = await NicheReservationAPI.getByPhoneNumber(phoneNumber);
      setNicheReservations(response.data.$values);
    } catch (error) {
      console.error("Error fetching niche reservations:", error);
      toast.error("Không thể tải danh sách đặt chỗ.");
    }
  }, []);

  const updateNicheReservation = async (updatedRecord: any) => {
    try {
      await NicheReservationAPI.update(
        updatedRecord.reservationId,
        updatedRecord
      );
      toast.success("Cập nhật đơn đặt chỗ thành công!");
      fetchNicheReservations(user.phone); // Refresh reservations
    } catch (error) {
      console.error("Error updating niche reservation:", error);
      toast.error("Không thể cập nhật đơn đặt chỗ.");
    }
  };

  const deleteNicheReservation = async (reservationId: number) => {
    try {
      await NicheReservationAPI.delete(reservationId);
      setNicheReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId === reservationId
            ? { ...reservation, status: "Canceled" }
            : reservation
        )
      );
      toast.success("Hủy đơn đặt chỗ thành công!");
    } catch (error) {
      console.error("Error canceling niche reservation:", error);
      toast.error("Không thể hủy đơn đặt chỗ.");
    }
  };

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
        contracts,
        orders,
        setOrders,
        fetchOrders,
        setContracts,
        fetchBuildingsData,
        fetchNiches,
        fetchNichesForCustomer,
        fetchReservations,
        createReservation,
        deleteReservation,
        fetchVisitRegistrations,
        deleteVisitRegistration,
        fetchContracts,
        resetSelections,
        resetSectionAndNiche,
        resetNiche,
        user,
        loading,
        login,
        register,
        logout,
        nicheReservations,
        fetchNicheReservations,
        updateNicheReservation,
        deleteNicheReservation,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
