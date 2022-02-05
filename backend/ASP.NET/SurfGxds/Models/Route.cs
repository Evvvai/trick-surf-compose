using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class Route
    {
        public int Id { get; set; }
        public int? TrickId { get; set; }
        public int? TriggerId { get; set; }

        public virtual Trick? Trick { get; set; }
        public virtual Trigger? Trigger { get; set; }
    }
}
