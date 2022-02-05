using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class TimeOnlineTrend
    {
        public DateOnly? D { get; set; }
        public TimeOnly? T { get; set; }
        public decimal? Trend { get; set; }
        public string TrendStatus { get; set; } = null!;
    }
}
