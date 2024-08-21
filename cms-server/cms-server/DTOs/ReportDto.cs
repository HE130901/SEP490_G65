namespace cms_server.DTOs
{
    public class NicheDetailsReport
    {
        public int TotalNiches { get; set; }
        public int OccupiedNiches { get; set; }
        public int ReservedNiches { get; set; }
        public int AvailableNiches { get; set; }
        public int UnavailableNiches { get; set; }
        public List<AreaReport> NichesByArea { get; set; } = new List<AreaReport>();
        public List<StatusReport> NichesByStatus { get; set; } = new List<StatusReport>();
        public int TotalServiceOrders { get; set; }
        public int TotalVisitRegistrations { get; set; }
    }

    public class AreaReport
    {
        public int AreaId { get; set; }
        public string AreaAddress { get; set; }
        public int Count { get; set; }
        public int Occupied { get; set; }
        public int Reserved { get; set; }
        public int Available { get; set; }
        public int Unavailable { get; set; }
    }

    public class StatusReport
    {
        public string Status { get; set; }
        public int Count { get; set; }
    }


    public class ContractSummaryReport
    {
        public int TotalContracts { get; set; }
        public int ActiveContracts { get; set; }
        public int InactiveContracts { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageContractValue { get; set; }
        public List<ContractStatusReport> ContractsByStatus { get; set; } = new List<ContractStatusReport>();
    }

    public class ContractStatusReport
    {
        public string Status { get; set; }
        public int Count { get; set; }
        public decimal TotalAmount { get; set; }
    }


    public class ServiceOverviewDTO
    {
        public int TotalServices { get; set; }
        public decimal? TotalRevenue { get; set; }
        public decimal? AverageOrderValue { get; set; }
        public Dictionary<string, int> ServicesByCategory { get; set; }
        public Dictionary<string, decimal?> RevenueByCategory { get; set; }
        public Dictionary<string, int> ServicesByStatus { get; set; }
    }
}
