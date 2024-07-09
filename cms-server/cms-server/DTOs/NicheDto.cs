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
        public int NicheId { get; set; }
        public string BuildingName { get; set; } = null!;
        public string? BuildingDescription { get; set; }
        public string? BuildingPicture { get; set; }
        public string FloorName { get; set; } = null!;
        public string? FloorDescription { get; set; }
        public string? FloorPicture { get; set; }
        public decimal? NichePrice { get; set; }
        public string AreaName { get; set; } = null!;
        public string? AreaDescription { get; set; }
        public string? AreaPicture { get; set; }
        public string NicheName { get; set; } = null!;
        public string? NicheDescription { get; set; }
    }
}
