using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class VisitRegistration
{
    public int VisitId { get; set; }

    public int CustomerId { get; set; }

    public int NicheId { get; set; }

    public DateTime VisitDate { get; set; }

    public string? Status { get; set; }

    public string? Note { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? ApprovalDate { get; set; }

    public virtual Staff? ApprovedByNavigation { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Niche Niche { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
