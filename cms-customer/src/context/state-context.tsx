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
import FloorAPI from "@/api/floorApi";
import AreaAPI from "@/api/areaApi";
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
  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [niches, setNiches] = useState([]);
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

  const handleRoleBasedRedirection = (role) => {
    console.log("Redirecting based on role:", role);
    if (role === "Guest" || role === "Customer") {
      router.push("/dashboard");
    } else if (role === "Staff" || role === "Manager") {
      router.push("/staff-dashboard");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await AuthAPI.login(email, password);
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      await fetchCurrentUser(token);

      console.log("User role after login:", role);
      handleRoleBasedRedirection(role);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please check your login information.");
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

  const fetchBuildings = useCallback(async () => {
    try {
      const response = await BuildingAPI.getAll();
      setBuildings(response.data.$values);
      console.log("Buildings fetched successfully:", response.data.$values);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  }, []);

  const fetchFloors = useCallback(async (buildingId) => {
    try {
      console.log("Fetching floors for building ID:", buildingId);
      const response = await FloorAPI.getAll(buildingId);
      setFloors(response.data.$values);
      console.log("Floors fetched successfully:", response.data.$values);
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  }, []);

  const fetchAreas = useCallback(async (buildingId, floorId) => {
    try {
      console.log(
        "Fetching areas for building ID:",
        buildingId,
        "and floor ID:",
        floorId
      );
      const response = await AreaAPI.getAll(buildingId, floorId);
      setAreas(response.data.$values);
      console.log("Areas fetched successfully:", response.data.$values);
    } catch (error) {
      console.error("Error fetching areas:", error);
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
        floors,
        setFloors,
        areas,
        setAreas,
        niches,
        setNiches,
        reservations,
        setReservations,
        visitRegistrations,
        setVisitRegistrations,
        fetchBuildings,
        fetchFloors,
        fetchAreas,
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
        handleRoleBasedRedirection,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
