using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class Trick
    {
        public Trick()
        {
            Completes = new HashSet<Complete>();
            Routes = new HashSet<Route>();
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public short? Point { get; set; }
        public sbyte? Velocity { get; set; }
        public DateTime? DateAdd { get; set; }
        public int? AuthorId { get; set; }
        public int? MapId { get; set; }

        public virtual Player? Author { get; set; }
        public virtual Map? Map { get; set; }
        public virtual ICollection<Complete> Completes { get; set; }
        public virtual ICollection<Route> Routes { get; set; }
    }
}
