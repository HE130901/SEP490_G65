using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class NicheHistory
{
    public int NicheHistoryId { get; set; }

    public int NicheId { get; set; }

    public int CustomerId { get; set; }

    public int? DeceasedId { get; set; }

    public int? ContractId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public virtual Contract? Contract { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Deceased? Deceased { get; set; }

    public virtual Niche Niche { get; set; } = null!;
}
