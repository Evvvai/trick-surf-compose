using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string? Steamid64 { get; set; }
        public string? Username { get; set; }
        public string? Profileurl { get; set; }
        public string? Avatarfull { get; set; }
        public string? AvatarCustom { get; set; }
        public string? Dashboard { get; set; }
        public string? Role { get; set; }
        public DateTime? DateReg { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}
