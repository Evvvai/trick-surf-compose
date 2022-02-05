using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class TimeOnlineStatus
    {
        public int Id { get; set; }
        public int? PlayerId { get; set; }
        public int? Status { get; set; }
        public DateTime? Timestamp { get; set; }

        public virtual Player? Player { get; set; }
    }
}
