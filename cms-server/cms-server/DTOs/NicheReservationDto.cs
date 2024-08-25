namespace cms_server.DTOs
{

    public class CreateNicheReservationDto
    {
        public int NicheId { get; set; }
        public string Name { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string SignAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string? Note { get; set; }
        public string? Email { get; set; }

    }

    // DTO for updating niche reservation
    public class UpdateNicheReservationDto
    {
        public DateTime? ConfirmationDate { get; set; }
        public string SignAddress { get; set; }
        public string Note { get; set; }
    }

    public class NicheReservationDto
    {
        public int ReservationId { get; set; }
        public string Name { get; set; }
        public string NicheCode { get; set; }

        public string PhoneNumber { get; set; }
        public string NicheAddress { get; set; }
        public string ReservationCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
    }

    public class NicheReservationDetailDto
    {
        public int ReservationId { get; set; }
        public string ReservationCode { get; set; }
        public string? Email { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string NicheAddress { get; set; }
        public int NicheId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
        public string SignAddress { get; set; }
        public string NameConfirmedBy { get; set; }
    }

    public class UpdateNicheReservationForStaffDto
    {
        public int NicheId { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string? Note { get; set; }
        public string? SignAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Name { get; set; }
    }
    public class NicheReservationApprovedDto
    {
        public int ReservationId { get; set; }
        public string ReservationCode { get; set; }
        public int NicheId { get; set; }
        public string Status { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string NicheCode { get; set; }
        public string NicheAddress { get; set; }

        public string? CustomerEmail { get; set; }



        public string SignAddress { get; set; }
        public string Note { get; set; }

    }
}
