using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class Complete
    {
        public Complete()
        {
            StrafesTwrUpdateBeforeWrNavigations = new HashSet<StrafesTwrUpdate>();
            StrafesTwrUpdateNowWrNavigations = new HashSet<StrafesTwrUpdate>();
        }

        public int Id { get; set; }
        public int? PlayerId { get; set; }
        public int? TrickId { get; set; }
        public short? Speed { get; set; }
        public float? Time { get; set; }
        public DateTime? DateAdd { get; set; }

        public virtual Player? Player { get; set; }
        public virtual Trick? Trick { get; set; }
        public virtual ICollection<StrafesTwrUpdate> StrafesTwrUpdateBeforeWrNavigations { get; set; }
        public virtual ICollection<StrafesTwrUpdate> StrafesTwrUpdateNowWrNavigations { get; set; }
    }
}
