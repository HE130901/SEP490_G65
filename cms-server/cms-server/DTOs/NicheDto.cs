namespace cms_server.DTOs
{
    public class NicheDto
    {
        public int NicheId { get; set; }
        public string NicheName { get; set; } = null!;
        public string? ContractStatus { get; set; }
        public string? NicheDescription { get; set; }
        public int? ContractId { get; set; }
        public string DeceasedName { get; set; }
    }



        public class NicheDetailDto
        {
            public string NicheAddress { get; set; } = null!;
            public string? NicheDescription { get; set; }
            public string? CustomerName { get; set; }
            public string? DeceasedName { get; set; }
            public DateOnly? StartDate { get; set; }
            public DateOnly? EndDate { get; set; }
            public string? ContractStatus { get; set; }
        }
    



}
