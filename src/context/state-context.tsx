"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "@/utils/axios-config";
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
      const response = await axios.get("/api/auth/get-current-user", {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const response = await axios.post("/api/auth/login", { email, password });
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
      await axios.post("/api/auth/register", formData);
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

  // fetchBuildings setting the state and logging the data.
  const fetchBuildings = useCallback(async () => {
    try {
      const response = await fetch("https://localhost:7148/api/Buildings");
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response but received " + contentType);
      }

      const data = await response.json();

      // Extract the building data from the response structure
      const buildings = data.$values.map((building) => ({
        buildingId: building.buildingId,
        buildingName: building.buildingName,
        buildingDescription: building.buildingDescription,
        buildingPicture: building.buildingPicture,
        floors: building.floors.$values,
      }));

      setBuildings(buildings);
      console.log("Buildings fetched successfully:", buildings);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  }, []);

  const fetchFloors = useCallback(async (buildingId) => {
    try {
      console.log("Fetching floors for building ID:", buildingId);
      const response = await axios.get(`/api/Buildings/${buildingId}/floors`);
      console.log("Floors response data:", response.data);
      const floors = response.data.$values.map((floor) => ({
        floorId: floor.floorId,
        buildingId: floor.buildingId,
        floorName: floor.floorName,
        floorDescription: floor.floorDescription,
        nichePrice: floor.nichePrice,
        areas: floor.areas.$values,
      }));
      setFloors(floors);
      console.log("Floors set in state:", floors);
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
      const response = await axios.get(
        `/api/Buildings/${buildingId}/floors/${floorId}/areas`
      );
      console.log("Areas response data:", response.data);
      const areas = response.data.$values.map((area) => ({
        areaId: area.areaId,
        floorId: area.floorId,
        areaName: area.areaName,
        areaDescription: area.areaDescription,
        niches: area.niches.$values,
      }));
      setAreas(areas);
      console.log("Areas set in state:", areas);
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
      const response = await axios.get(
        `/api/Buildings/${buildingId}/floors/${floorId}/areas/${areaId}/niches`
      );
      console.log("Niches response data:", response.data);
      const niches = response.data.$values.map((niche) => ({
        nicheId: niche.nicheId,
        areaId: niche.areaId,
        nicheName: niche.nicheName,
        status: niche.status,
      }));
      setNiches(niches);
      console.log("Niches set in state:", niches);
    } catch (error) {
      console.error("Error fetching niches:", error);
    }
  }, []);

  const fetchReservations = async (customerId) => {
    try {
      const response = await axios.get(
        `/api/NicheReservations/Customer/${customerId}`
      );
      setReservations(response.data.$values);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const deleteReservation = async (reservationId) => {
    try {
      await axios.delete(`/api/NicheReservations/${reservationId}`);
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
      const response = await axios.get(
        `/api/VisitRegistrations/customer/${customerId}`
      );
      setVisitRegistrations(response.data.$values);
    } catch (error) {
      console.error("Error fetching visit registrations:", error);
    }
  };

  const deleteVisitRegistration = async (visitId) => {
    try {
      await axios.delete(`/api/VisitRegistrations/${visitId}`);
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
