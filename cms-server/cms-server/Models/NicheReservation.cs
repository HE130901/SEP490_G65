using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class NicheReservation
{
    public int ReservationId { get; set; }

    public int NicheId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ConfirmationDate { get; set; }

    public string? Status { get; set; }

    public string? SignAddress { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Note { get; set; }

    public string? Name { get; set; }

    public int? ConfirmedBy { get; set; }

    public virtual Staff? ConfirmedByNavigation { get; set; }

    public virtual Niche Niche { get; set; } = null!;
}
