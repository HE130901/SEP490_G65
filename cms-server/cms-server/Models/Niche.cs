using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class Niche
{
    public int NicheId { get; set; }

    public int AreaId { get; set; }

    public string NicheName { get; set; } = null!;

    public string? Status { get; set; }

    public string? NicheDescription { get; set; }

    public int? CustomerId { get; set; }

    public int? DeceasedId { get; set; }

    public virtual Area Area { get; set; } = null!;

    public virtual ICollection<Contract> Contracts { get; set; } = new List<Contract>();

    public virtual ICollection<Deceased> Deceaseds { get; set; } = new List<Deceased>();

    public virtual ICollection<NicheHistory> NicheHistories { get; set; } = new List<NicheHistory>();

    public virtual ICollection<NicheReservation> NicheReservations { get; set; } = new List<NicheReservation>();

    public virtual ICollection<ServiceOrder> ServiceOrders { get; set; } = new List<ServiceOrder>();

    public virtual ICollection<VisitRegistration> VisitRegistrations { get; set; } = new List<VisitRegistration>();
}
