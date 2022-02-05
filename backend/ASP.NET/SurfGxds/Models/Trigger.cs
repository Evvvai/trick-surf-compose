using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class Trigger
    {
        public Trigger()
        {
            HopTriggers = new HashSet<HopTrigger>();
            Routes = new HashSet<Route>();
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public string? AlternativeName { get; set; }
        public string? Src { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Z { get; set; }
        public int? MapId { get; set; }

        public virtual Map? Map { get; set; }
        public virtual ICollection<HopTrigger> HopTriggers { get; set; }
        public virtual ICollection<Route> Routes { get; set; }
    }
}
