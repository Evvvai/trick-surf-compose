using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class TwrUpdate
    {
        public int? NowWr { get; set; }
        public int? BeforeWr { get; set; }

        public virtual Complete? BeforeWrNavigation { get; set; }
        public virtual Complete? NowWrNavigation { get; set; }
    }
}
