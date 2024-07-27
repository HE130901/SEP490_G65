using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class ContractRenew
{
    public int ContractRenewId { get; set; }

    public int? ContractId { get; set; }

    public string? ContractRenewCode { get; set; }

    public string? Status { get; set; }

    public DateOnly? CreatedDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? Note { get; set; }

    public virtual Contract? Contract { get; set; }
}
