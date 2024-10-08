﻿using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class Contract
{
    public int ContractId { get; set; }

    public int CustomerId { get; set; }

    public int StaffId { get; set; }

    public int NicheId { get; set; }

    public int? DeceasedId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public string? Note { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? ContractCode { get; set; }

    public virtual ICollection<ContractRenew> ContractRenews { get; set; } = new List<ContractRenew>();

    public virtual Customer Customer { get; set; } = null!;

    public virtual Deceased? Deceased { get; set; }

    public virtual Niche Niche { get; set; } = null!;

    public virtual ICollection<NicheHistory> NicheHistories { get; set; } = new List<NicheHistory>();

    public virtual Staff Staff { get; set; } = null!;
}
