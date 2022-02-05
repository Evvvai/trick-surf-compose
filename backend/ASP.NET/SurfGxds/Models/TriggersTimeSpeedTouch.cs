using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class TriggersTimeSpeedTouch
    {
        public int? CompleteId { get; set; }
        public int? TriggerBeforeId { get; set; }
        public int? TriggerId { get; set; }
        public int? SpeedStart { get; set; }
        public int? SpeedEnd { get; set; }
        public int? SpeedBeforeMax { get; set; }
        public int? SpeedDuringMax { get; set; }
        public float? TimeBefore { get; set; }
        public float? TimeDuring { get; set; }

        public virtual Complete? Complete { get; set; }
        public virtual Trigger? Trigger { get; set; }
        public virtual Trigger? TriggerBefore { get; set; }
    }
}
