using System;
using System.Collections.Generic;

namespace cms_server.Models;

public partial class SystemSetting
{
    public int SettingId { get; set; }

    public string? SettingName { get; set; }

    public decimal? SettingNumber { get; set; }

    public string? SettingUnit { get; set; }

    public string? SettingType { get; set; }
}
