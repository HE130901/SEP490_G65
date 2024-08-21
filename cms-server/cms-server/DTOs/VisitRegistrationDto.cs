namespace cms_server.DTOs
{

    public class VisitRegistrationDto
    {
        public int VisitId { get; set; }
        public int CustomerId { get; set; }
        public int NicheId { get; set; }
        public string? CustomerName { get; set; }
        public string? StaffName { get; set; }
        public string? NicheAddress { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? VisitDate { get; set; }
        public string? Status { get; set; } = "Pending";
        public int AccompanyingPeople { get; set; }
        public string? Note { get; set; }
        public int? ApprovedBy { get; set; }
        public string? FormattedVisitDate => VisitDate?.ToString("HH:mm dd/MM/yyyy");
        public string? FormattedCreatedDate => CreatedDate?.ToString("HH:mm dd/MM/yyyy");

        public string? VisitCode { get; set; }
    }

}
