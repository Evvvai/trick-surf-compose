using System;
using System.Collections.Generic;

namespace SurfGxds.Models
{
    public partial class TricksRouteViewer
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public short? Point { get; set; }
        public sbyte? Velocity { get; set; }
        public DateTime? DateAdd { get; set; }
        public string? RouteStr { get; set; }
        public string? RouteId { get; set; }
        public long? Len { get; set; }
        public string? AuthorSteamid { get; set; }
        public string? Author { get; set; }
        public int? MapId { get; set; }
    }
}
