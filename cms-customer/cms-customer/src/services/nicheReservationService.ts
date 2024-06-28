import axiosInstance from "@/utils/axiosInstance";

const NicheReservationAPI = {
  getByPhoneNumber(phoneNumber: string) {
    const url = `/api/NicheReservations/by-phone/${phoneNumber}`;
    return axiosInstance.get(url);
  },
  
  delete(reservationId: number) {
    const url = `/api/NicheReservations/${reservationId}`;
    return axiosInstance.delete(url);
  },
  
  update(reservationId: number, data: any) {
    const url = `/api/NicheReservations/${reservationId}`;
    return axiosInstance.put(url, data);
  }
};

export default NicheReservationAPI;
