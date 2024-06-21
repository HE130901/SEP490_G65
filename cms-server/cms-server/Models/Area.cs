using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class Area
{
    public int AreaId { get; set; }

    public int FloorId { get; set; }

    public string AreaName { get; set; } = null!;

    public string? AreaDescription { get; set; }

    public string? AreaPicture { get; set; }

    public virtual Floor Floor { get; set; } = null!;

    public virtual ICollection<Niche> Niches { get; set; } = new List<Niche>();
}
