using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class TimeOnline
    {
        public int Id { get; set; }
        public int? PlayerId { get; set; }
        public TimeOnly? Time { get; set; }
        public DateTime? TimeJoin { get; set; }
        public DateTime? TimeLeft { get; set; }

        public virtual Player? Player { get; set; }
    }
}
