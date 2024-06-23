// src/context/StateContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AuthAPI from "@/api/authApi";
import BuildingAPI from "@/api/buildingApi";
import NicheAPI from "@/api/nicheApi";
import NicheReservationAPI from "@/api/nicheReservationApi";
import VisitRegistrationAPI from "@/api/visitRegistrationApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const StateContext = createContext(null);

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};

export const StateProvider = ({ children }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [niches, setNiches] = useState([]); // Ensure this is defined
  const [reservations, setReservations] = useState([]);
  const [visitRegistrations, setVisitRegistrations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
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

      console.log("User fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await AuthAPI.login(email, password);
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      await fetchCurrentUser(token);

      console.log("User role after login:", role);
      router.push("/dashboard");
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại sau.");
    }
  };

  const register = async (formData) => {
    try {
      await AuthAPI.register(formData);
      router.push("/auth/login");
      toast.success("Registration successful.");
    } catch (error) {
      console.error("Registration failed", error);
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
      console.log(
        "Buildings, floors, and areas fetched successfully:",
        response.data.buildings.$values
      );
    } catch (error) {
      console.error("Error fetching buildings, floors, and areas:", error);
    }
  }, []);

  const fetchNiches = useCallback(async (buildingId, floorId, areaId) => {
    try {
      console.log(
        "Fetching niches for building ID:",
        buildingId,
        "floor ID:",
        floorId,
        "and area ID:",
        areaId
      );
      const response = await NicheAPI.getAll(buildingId, floorId, areaId);
      setNiches(response.data.$values);
      console.log("Niches fetched successfully:", response.data.$values);
    } catch (error) {
      console.error("Error fetching niches:", error);
    }
  }, []);

  const fetchReservations = async (customerId) => {
    try {
      const response = await NicheReservationAPI.getByCustomerId(customerId);
      setReservations(response.data.$values);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const deleteReservation = async (reservationId) => {
    try {
      await NicheReservationAPI.delete(reservationId);
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.reservationId !== reservationId
        )
      );
      toast.success("Reservation deleted successfully!");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete the reservation.");
    }
  };

  const fetchVisitRegistrations = async (customerId) => {
    try {
      const response = await VisitRegistrationAPI.getByCustomerId(customerId);
      setVisitRegistrations(response.data.$values);
    } catch (error) {
      console.error("Error fetching visit registrations:", error);
    }
  };

  const deleteVisitRegistration = async (visitId) => {
    try {
      await VisitRegistrationAPI.delete(visitId);
      setVisitRegistrations((prevRegistrations) =>
        prevRegistrations.filter(
          (registration) => registration.visitId !== visitId
        )
      );
      toast.success("Visit registration deleted successfully!");
    } catch (error) {
      console.error("Error deleting visit registration:", error);
      toast.error("Failed to delete the visit registration.");
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
        buildings,
        setBuildings,
        niches,
        setNiches, // Ensure this is passed here
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
