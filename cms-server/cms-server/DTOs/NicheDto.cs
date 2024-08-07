namespace cms_server.DTOs
{
    public class NicheDto
    {
        public int NicheId { get; set; }
        public string NicheStatus { get; set; } = null!;
        public string NicheName { get; set; } = null!;
        public string? NicheAddress { get; set; }
        public string? ContractStatus { get; set; }
        public string? NicheDescription { get; set; }
        public int? ContractId { get; set; }
        public string DeceasedName { get; set; }

    }

    public class NicheDetailDto
    {
        public int NicheId { get; set; }
        public string BuildingName { get; set; } = null!;
        public string? BuildingDescription { get; set; }
        public string? BuildingPicture { get; set; }
        public string FloorName { get; set; } = null!;
        public string? FloorDescription { get; set; }
        public string? FloorPicture { get; set; }
        public string AreaName { get; set; } = null!;
        public string? AreaDescription { get; set; }
        public string? AreaPicture { get; set; }
        public string NicheName { get; set; } = null!;
        public string? NicheDescription { get; set; }
    }

    public class NicheDetailDto3
    {
        public int NicheId { get; set; }

        public string NicheCode { get; set; }
        public int ContractId { get; set; }
        public string NicheAddress { get; set; }
        public string FullName { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string Status { get; set; }
        public string NicheDescription { get; set; }
        public List<VisitRegistrationDto3> VisitRegistrations { get; set; }
        public List<ServiceOrderDto3> ServiceOrders { get; set; }
    }

    public class VisitRegistrationDto3
    {
        public int VisitId { get; set; }
        public DateTime? VisitDate { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
        public int? AccompanyingPeople { get; set; }
    }

    public class ServiceOrderDto3
    {
        public int ServiceOrderId { get; set; }
        public DateTime? OrderDate { get; set; }
        public List<ServiceOrderDetailDto3> ServiceOrderDetails { get; set; }
    }

    public class ServiceOrderDetailDto3
    {
        public string ServiceName { get; set; }
        public int Quantity { get; set; }
        public string? CompletionImage { get; set; }
        public string? Status { get; set; }
    }
}
