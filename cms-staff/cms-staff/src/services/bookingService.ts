import axiosInstance from "@/utils/axiosInstance";

const BookingAPI = {
  getAllBookings() {
    return axiosInstance.get("/api/NicheReservations");
  },
  // Các phương thức khác như addBooking, updateBooking, deleteBooking có thể được thêm ở đây
};

export default BookingAPI;
