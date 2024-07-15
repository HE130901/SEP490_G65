using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class ServiceOrderDetail
{
    public int ServiceOrderDetailId { get; set; }

    public int ServiceOrderId { get; set; }

    public int ServiceId { get; set; }

    public int Quantity { get; set; }

    public string? CompletionImage { get; set; }

    public string? Status { get; set; }

    public virtual Service Service { get; set; } = null!;

    public virtual ServiceOrder ServiceOrder { get; set; } = null!;
}
