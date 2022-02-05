using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class Map
    {
        public Map()
        {
            Tricks = new HashSet<Trick>();
            Triggers = new HashSet<Trigger>();
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public DateTime? DateCreated { get; set; }

        public virtual ICollection<Trick> Tricks { get; set; }
        public virtual ICollection<Trigger> Triggers { get; set; }
    }
}
