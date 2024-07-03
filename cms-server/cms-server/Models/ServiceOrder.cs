using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class ServiceOrder
{
    public int ServiceOrderId { get; set; }

    public int CustomerId { get; set; }

    public int NicheId { get; set; }

    public DateTime? OrderDate { get; set; }

    public int? StaffId { get; set; }

    public string? ServiceOrderCode { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Niche Niche { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<ServiceOrderDetail> ServiceOrderDetails { get; set; } = new List<ServiceOrderDetail>();

    public virtual Staff? Staff { get; set; }
}
