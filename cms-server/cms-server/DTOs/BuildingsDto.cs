namespace cms_server.DTOs
{


    public class BuildingsFloorsAreasDto
    {
        public List<BuildingDto> Buildings { get; set; }
    }

    public class BuildingDto
    {
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        public string BuildingDescription { get; set; }
        public string BuildingPicture { get; set; }
        public List<FloorDto> Floors { get; set; }
    }

    public class FloorDto
    {
        public int FloorId { get; set; }
        public string FloorName { get; set; }
        public List<AreaDto> Areas { get; set; }
    }

    public class AreaDto
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }
    }

    public class NicheDto1
    {
        public int NicheId { get; set; }
        public string NicheName { get; set; }
        public string Status { get; set; }
        public bool ReservedByUser { get; set; }
    }
    public class NicheDto2
    {
        public int NicheId { get; set; }
        public string NicheName { get; set; }
        public string Status { get; set; }
    }
}
