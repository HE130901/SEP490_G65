namespace cms_server.DTOs
{
    public class ContractDetailDto
    {
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerCitizenID { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CitizenIdsupplier { get; set; }
        public DateOnly? CitizenIdissuanceDate { get; set; }
        public string DeceasedName { get; set; } = null!;
        public string? DeceasedCitizenID { get; set; }
        public DateOnly? DeceasedDateOfBirth { get; set; }
        public DateOnly? DeceasedDateOfDeath { get; set; }
        public string? DeceasedDeathCertificateNumber { get; set; }
        public string? DeceasedDeathCertificateSupplier { get; set; }
        public string? DeceasedRelationshipWithCustomer { get; set; }
        public int ContractId { get; set; }
        public int CustomerId { get; set; }
        public int StaffId { get; set; }
        public string StaffName { get; set; } = null!;
        public int NicheId { get; set; }
        public string? NicheName { get; set; }
        public int? DeceasedId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
        public decimal? TotalAmount { get; set; }

    } 
        public class ContractDto
        {
            public int ContractId { get; set; }
        public int NicheId { get; set; }
        public string NicheName { get; set; } = null!;
            public string CustomerName { get; set; } = null!;
            public string DeceasedName { get; set; } = null!;
            public string? DeceasedRelationshipWithCustomer { get; set; }
            public DateOnly StartDate { get; set; }
            public DateOnly? EndDate { get; set; }
            public string? Status { get; set; }
        }
    

}
