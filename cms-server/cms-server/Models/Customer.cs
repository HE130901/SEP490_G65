using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? PasswordHash { get; set; }

    public string? CitizenId { get; set; }

    public DateOnly? CitizenIdissuanceDate { get; set; }

    public string? CitizenIdsupplier { get; set; }

    public virtual ICollection<Contract> Contracts { get; set; } = new List<Contract>();

    public virtual ICollection<Deceased> Deceaseds { get; set; } = new List<Deceased>();

    public virtual ICollection<NicheHistory> NicheHistories { get; set; } = new List<NicheHistory>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<ServiceOrder> ServiceOrders { get; set; } = new List<ServiceOrder>();

    public virtual ICollection<VisitRegistration> VisitRegistrations { get; set; } = new List<VisitRegistration>();
}
