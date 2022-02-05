using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class Twr
    {
        public int? TrickId { get; set; }
        public int? CompleteId { get; set; }

        public virtual Complete? Complete { get; set; }
        public virtual Trick? Trick { get; set; }
    }
}
