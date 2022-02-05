using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class StrafesTwrUpdate
    {
        public int Id { get; set; }
        public int? NowWr { get; set; }
        public int? BeforeWr { get; set; }

        public virtual Complete? BeforeWrNavigation { get; set; }
        public virtual Complete? NowWrNavigation { get; set; }
    }
}
