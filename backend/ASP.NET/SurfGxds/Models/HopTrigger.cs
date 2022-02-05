using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class HopTrigger
    {
        public int Id { get; set; }
        public int? TriggerId { get; set; }

        public virtual Trigger? Trigger { get; set; }
    }
}
