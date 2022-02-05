using Microsoft.EntityFrameworkCore;

namespace SurfGxds.Data
{
    public partial class SurfGxdsContextProcedures : DbContext
    {
        public virtual DbSet<GetTopAvg> GetTopAvg { get; set; } = null!;
        public virtual DbSet<GetTrickSvr> GetTrickSvr { get; set; } = null!;
        public virtual DbSet<GetTrickTvr> GetTrickTvr { get; set; } = null!;
        public virtual DbSet<PatchTrickRouteParse> PatchTrickRouteParse { get; set; } = null!;
        public virtual DbSet<PutPlayerData> PutPlayerData { get; set; } = null!;

        public SurfGxdsContextProcedures() { }

        public SurfGxdsContextProcedures(DbContextOptions<SurfGxdsContextProcedures> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GetTopAvg>(entity =>
            {
                entity.HasNoKey();
                entity.Property(e => e.PlayerId).HasColumnName("player_id");
                entity.Property(e => e.Nick).HasColumnName("nick");
                entity.Property(e => e.Ac).HasColumnName("ac");
                entity.Property(e => e.AcPlace).HasColumnName("ac_place");
                entity.Property(e => e.Ap).HasColumnName("ap");
                entity.Property(e => e.ApPlace).HasColumnName("ap_place");
                entity.Property(e => e.Up).HasColumnName("up");
                entity.Property(e => e.UpPlace).HasColumnName("up_place");
                entity.Property(e => e.Uc).HasColumnName("uc");
                entity.Property(e => e.UcPlace).HasColumnName("uc_place");
                entity.Property(e => e.Avg).HasColumnName("avg");
                entity.Property(e => e.Place).HasColumnName("place");
                entity.Property(e => e.PercentComplete).HasColumnName("percent_complete");
            });

            modelBuilder.Entity<GetTrickSvr>(entity =>
            {
                entity.HasNoKey();
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Steamid).HasColumnName("steamid");
                entity.Property(e => e.Nick).HasColumnName("nick");
                entity.Property(e => e.DateAdd).HasColumnName("date_add");
                entity.Property(e => e.Res).HasColumnName("res");
                entity.Property(e => e.MyRes).HasColumnName("my_res");
                entity.Property(e => e.Place).HasColumnName("place");
            });

            modelBuilder.Entity<GetTrickTvr>(entity =>
            {
                entity.HasNoKey();
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Steamid).HasColumnName("steamid");
                entity.Property(e => e.Nick).HasColumnName("nick");
                entity.Property(e => e.DateAdd).HasColumnName("date_add");
                entity.Property(e => e.Res).HasColumnName("res");
                entity.Property(e => e.MyRes).HasColumnName("my_res");
                entity.Property(e => e.Place).HasColumnName("place");
            });

            modelBuilder.Entity<PatchTrickRouteParse>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Len).HasColumnName("len");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name");

                entity.Property(e => e.Point).HasColumnName("point");

                entity.Property(e => e.RouteId)
                    .HasColumnType("text")
                    .HasColumnName("route_id");

                entity.Property(e => e.RouteStr)
                    .HasColumnType("text")
                    .HasColumnName("route_str");

                entity.Property(e => e.Velocity).HasColumnName("velocity");
            });

            modelBuilder.Entity<PutPlayerData>(entity =>
            {
                entity.HasNoKey();

            });
        }
    }
}




