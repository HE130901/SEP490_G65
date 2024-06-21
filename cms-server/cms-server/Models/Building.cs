using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class Building
{
    public int BuildingId { get; set; }

    public string BuildingName { get; set; } = null!;

    public string? BuildingDescription { get; set; }

    public string? BuildingPicture { get; set; }

    public virtual ICollection<Floor> Floors { get; set; } = new List<Floor>();
}
