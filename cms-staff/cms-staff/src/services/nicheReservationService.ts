import axiosInstance from "@/utils/axiosInstance";

const NicheReservationAPI = {
  getAllNicheReservations() {
    return axiosInstance.get("/api/NicheReservations");
  },
  getNicheReservationDetails(id: number) {
    return axiosInstance.get(`/api/NicheReservations/details/${id}`);
  },
  createNicheReservation(data: any) {
    return axiosInstance.post("/api/NicheReservations", data);
  },
  deleteNicheReservation(id: number) {
    return axiosInstance.delete(`/api/NicheReservations/${id}`);
  },
  updateNicheReservation(id: number, data: any) {
    const token = localStorage.getItem("token");
    return axiosInstance.put(`/api/NicheReservations/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default NicheReservationAPI;
