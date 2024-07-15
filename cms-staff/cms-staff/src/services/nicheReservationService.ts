import axiosInstance from "@/utils/axiosInstance";

const NicheReservationAPI = {
  getAllNicheReservations() {
    return axiosInstance.get("/api/NicheReservations");
  },
};

export default NicheReservationAPI;
