using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    /// <summary>
    /// Cached route touch
    /// </summary>
    public partial class TriggersTimeSpeedRoute
    {
        public int? CompleteId { get; set; }
        public int? Index { get; set; }
        public string? RouteIds { get; set; }
        public float? SummaryTime { get; set; }

        public virtual Complete? Complete { get; set; }
    }
}
