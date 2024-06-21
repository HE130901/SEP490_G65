using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class Deceased
{
    public int DeceasedId { get; set; }

    public string? CitizenId { get; set; }

    public string FullName { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }

    public DateOnly? DateOfDeath { get; set; }

    public int? NicheId { get; set; }

    public int? CustomerId { get; set; }

    public virtual ICollection<Contract> Contracts { get; set; } = new List<Contract>();

    public virtual Customer? Customer { get; set; }

    public virtual Niche? Niche { get; set; }

    public virtual ICollection<NicheHistory> NicheHistories { get; set; } = new List<NicheHistory>();
}
