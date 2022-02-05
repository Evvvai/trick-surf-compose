using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class Player
    {
        public Player()
        {
            Completes = new HashSet<Complete>();
            TimeOnlineStatuses = new HashSet<TimeOnlineStatus>();
            TimeOnlines = new HashSet<TimeOnline>();
            Tricks = new HashSet<Trick>();
        }

        public int Id { get; set; }
        public string? Steamid { get; set; }
        public string? Steamid64 { get; set; }
        public string? Nick { get; set; }
        public DateTime? DateJoined { get; set; }

        public virtual ICollection<Complete> Completes { get; set; }
        public virtual ICollection<TimeOnlineStatus> TimeOnlineStatuses { get; set; }
        public virtual ICollection<TimeOnline> TimeOnlines { get; set; }
        public virtual ICollection<Trick> Tricks { get; set; }
    }
}
