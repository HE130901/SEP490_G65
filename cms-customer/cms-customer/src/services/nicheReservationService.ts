import axiosInstance from "@/utils/axiosInstance";

const NicheReservationAPI = {
  getByCustomerId(customerId: string) {
    const url = `/api/NicheReservations/Customer/${customerId}`;
    return axiosInstance.get(url);
  },
  delete(reservationId: string) {
    const url = `/api/NicheReservations/${reservationId}`;
    return axiosInstance.delete(url);
  },
};
export default NicheReservationAPI;
