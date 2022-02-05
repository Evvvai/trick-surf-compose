using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using SurfGxds.Models;

namespace SurfGxds.Data
{
    public partial class SurfGxdsContext : DbContext
    {
        public SurfGxdsContext()
        {
        }

        public SurfGxdsContext(DbContextOptions<SurfGxdsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Complete> Completes { get; set; } = null!;
        public virtual DbSet<HopTrigger> HopTriggers { get; set; } = null!;
        public virtual DbSet<Map> Maps { get; set; } = null!;
        public virtual DbSet<Player> Players { get; set; } = null!;
        public virtual DbSet<Models.Route> Routes { get; set; } = null!;
        public virtual DbSet<StrafesTwrUpdate> StrafesTwrUpdates { get; set; } = null!;
        public virtual DbSet<Swr> Swrs { get; set; } = null!;
        public virtual DbSet<SwrUpdate> SwrUpdates { get; set; } = null!;
        public virtual DbSet<TimeOnline> TimeOnlines { get; set; } = null!;
        public virtual DbSet<TimeOnlineStatus> TimeOnlineStatuses { get; set; } = null!;
        public virtual DbSet<TimeOnlineTrend> TimeOnlineTrends { get; set; } = null!;
        public virtual DbSet<Trick> Tricks { get; set; } = null!;
        public virtual DbSet<TricksRouteViewer> TricksRouteViewers { get; set; } = null!;
        public virtual DbSet<Trigger> Triggers { get; set; } = null!;
        public virtual DbSet<TriggersTimeSpeedRoute> TriggersTimeSpeedRoutes { get; set; } = null!;
        public virtual DbSet<TriggersTimeSpeedTouch> TriggersTimeSpeedTouches { get; set; } = null!;
        public virtual DbSet<Twr> Twrs { get; set; } = null!;
        public virtual DbSet<TwrUpdate> TwrUpdates { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_general_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<Complete>(entity =>
            {
                entity.ToTable("completes");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.PlayerId, "player_id");

                entity.HasIndex(e => e.TrickId, "trick_id");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DateAdd)
                    .HasColumnType("timestamp")
                    .HasColumnName("date_add")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.PlayerId).HasColumnName("player_id");

                entity.Property(e => e.Speed).HasColumnName("speed");

                entity.Property(e => e.Time).HasColumnName("time");

                entity.Property(e => e.TrickId).HasColumnName("trick_id");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.Completes)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_complete_players");

                entity.HasOne(d => d.Trick)
                    .WithMany(p => p.Completes)
                    .HasForeignKey(d => d.TrickId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_complete_strafes_tricks");
            });

            modelBuilder.Entity<HopTrigger>(entity =>
            {
                entity.ToTable("hop_triggers");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.TriggerId, "trick_id");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.TriggerId).HasColumnName("trigger_id");

                entity.HasOne(d => d.Trigger)
                    .WithMany(p => p.HopTriggers)
                    .HasForeignKey(d => d.TriggerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_hop_trigger_strafes_triggers");
            });

            modelBuilder.Entity<Map>(entity =>
            {
                entity.ToTable("maps");

                entity.HasIndex(e => e.Name, "name")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DateCreated)
                    .HasColumnType("timestamp")
                    .HasColumnName("date_created")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Player>(entity =>
            {
                entity.ToTable("players");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.Steamid, "steamid")
                    .IsUnique();

                entity.HasIndex(e => e.Steamid64, "steamid64")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DateJoined)
                    .HasColumnType("timestamp")
                    .HasColumnName("date_joined")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Nick)
                    .HasMaxLength(50)
                    .HasColumnName("nick");

                entity.Property(e => e.Steamid)
                    .HasMaxLength(50)
                    .HasColumnName("steamid");

                entity.Property(e => e.Steamid64)
                    .HasMaxLength(50)
                    .HasColumnName("steamid64");
            });

            modelBuilder.Entity<Models.Route>(entity =>
            {
                entity.ToTable("routes");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.TrickId, "trick_id");

                entity.HasIndex(e => e.TriggerId, "trigger_id");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.TrickId).HasColumnName("trick_id");

                entity.Property(e => e.TriggerId).HasColumnName("trigger_id");

                entity.HasOne(d => d.Trick)
                    .WithMany(p => p.Routes)
                    .HasForeignKey(d => d.TrickId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_routes_strafes_tricks");

                entity.HasOne(d => d.Trigger)
                    .WithMany(p => p.Routes)
                    .HasForeignKey(d => d.TriggerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_routes_strafes_triggers");
            });

            modelBuilder.Entity<StrafesTwrUpdate>(entity =>
            {
                entity.ToTable("strafes_twr_update");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.BeforeWr, "before_wr");

                entity.HasIndex(e => e.NowWr, "now_wr");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BeforeWr).HasColumnName("before_wr");

                entity.Property(e => e.NowWr).HasColumnName("now_wr");

                entity.HasOne(d => d.BeforeWrNavigation)
                    .WithMany(p => p.StrafesTwrUpdateBeforeWrNavigations)
                    .HasForeignKey(d => d.BeforeWr)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_twr_update_strafes_complete_2");

                entity.HasOne(d => d.NowWrNavigation)
                    .WithMany(p => p.StrafesTwrUpdateNowWrNavigations)
                    .HasForeignKey(d => d.NowWr)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_twr_update_strafes_complete");
            });

            modelBuilder.Entity<Swr>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("swr");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.CompleteId, "complete_id");

                entity.HasIndex(e => e.TrickId, "trick_id");

                entity.Property(e => e.CompleteId).HasColumnName("complete_id");

                entity.Property(e => e.TrickId).HasColumnName("trick_id");

                entity.HasOne(d => d.Complete)
                    .WithMany()
                    .HasForeignKey(d => d.CompleteId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_swr_strafes_complete");

                entity.HasOne(d => d.Trick)
                    .WithMany()
                    .HasForeignKey(d => d.TrickId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_swr_strafes_tricks");
            });

            modelBuilder.Entity<SwrUpdate>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("swr_update");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.BeforeWr, "before_wr");

                entity.HasIndex(e => e.NowWr, "now_wr");

                entity.Property(e => e.BeforeWr).HasColumnName("before_wr");

                entity.Property(e => e.NowWr).HasColumnName("now_wr");

                entity.HasOne(d => d.BeforeWrNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.BeforeWr)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_swr_update_strafes_complete_2");

                entity.HasOne(d => d.NowWrNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.NowWr)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_swr_update_strafes_complete");
            });

            modelBuilder.Entity<TimeOnline>(entity =>
            {
                entity.ToTable("time_online");

                entity.HasIndex(e => e.PlayerId, "player_id");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.PlayerId).HasColumnName("player_id");

                entity.Property(e => e.Time)
                    .HasColumnType("time")
                    .HasColumnName("time");

                entity.Property(e => e.TimeJoin)
                    .HasColumnType("timestamp")
                    .HasColumnName("time_join");

                entity.Property(e => e.TimeLeft)
                    .HasColumnType("timestamp")
                    .HasColumnName("time_left");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.TimeOnlines)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_time_online_players");
            });

            modelBuilder.Entity<TimeOnlineStatus>(entity =>
            {
                entity.ToTable("time_online_status");

                entity.HasIndex(e => e.PlayerId, "player_id");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.PlayerId).HasColumnName("player_id");

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Timestamp)
                    .HasColumnType("timestamp")
                    .HasColumnName("timestamp")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.TimeOnlineStatuses)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_time_online_status_players");
            });

            modelBuilder.Entity<TimeOnlineTrend>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("time_online_trend");

                entity.Property(e => e.D).HasColumnName("d");

                entity.Property(e => e.T)
                    .HasColumnType("time")
                    .HasColumnName("t");

                entity.Property(e => e.Trend)
                    .HasPrecision(35)
                    .HasColumnName("trend");

                entity.Property(e => e.TrendStatus)
                    .HasMaxLength(4)
                    .HasColumnName("trendStatus")
                    .HasDefaultValueSql("''")
                    .UseCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<Trick>(entity =>
            {
                entity.ToTable("tricks");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.AuthorId, "author_id");

                entity.HasIndex(e => e.MapId, "map_id");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AuthorId).HasColumnName("author_id");

                entity.Property(e => e.DateAdd)
                    .HasColumnType("timestamp")
                    .HasColumnName("date_add")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.MapId)
                    .HasColumnName("map_id")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name");

                entity.Property(e => e.Point).HasColumnName("point");

                entity.Property(e => e.Velocity).HasColumnName("velocity");

                entity.HasOne(d => d.Author)
                    .WithMany(p => p.Tricks)
                    .HasForeignKey(d => d.AuthorId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_tricks_players");

                entity.HasOne(d => d.Map)
                    .WithMany(p => p.Tricks)
                    .HasForeignKey(d => d.MapId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_tricks_maps");
            });

            modelBuilder.Entity<TricksRouteViewer>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("tricks_route_viewer");

                entity.Property(e => e.Author)
                    .HasMaxLength(50)
                    .HasColumnName("author")
                    .UseCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.AuthorSteamid)
                    .HasMaxLength(50)
                    .HasColumnName("author_steamid")
                    .UseCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.DateAdd)
                    .HasColumnType("timestamp")
                    .HasColumnName("date_add")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Len).HasColumnName("len");

                entity.Property(e => e.MapId)
                    .HasColumnName("map_id")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name")
                    .UseCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Point).HasColumnName("point");

                entity.Property(e => e.RouteId)
                    .HasColumnType("text")
                    .HasColumnName("route_id")
                    .UseCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RouteStr)
                    .HasColumnType("text")
                    .HasColumnName("route_str")
                    .UseCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Velocity).HasColumnName("velocity");
            });

            modelBuilder.Entity<Trigger>(entity =>
            {
                entity.ToTable("triggers");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.MapId, "map_id");

                entity.HasIndex(e => e.Name, "name")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AlternativeName)
                    .HasMaxLength(50)
                    .HasColumnName("alternative_name");

                entity.Property(e => e.MapId)
                    .HasColumnName("map_id")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .HasColumnName("name");

                entity.Property(e => e.Src)
                    .HasColumnType("text")
                    .HasColumnName("src");

                entity.Property(e => e.X).HasColumnName("x");

                entity.Property(e => e.Y).HasColumnName("y");

                entity.Property(e => e.Z).HasColumnName("z");

                entity.HasOne(d => d.Map)
                    .WithMany(p => p.Triggers)
                    .HasForeignKey(d => d.MapId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_triggers_maps");
            });

            modelBuilder.Entity<TriggersTimeSpeedRoute>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("triggers_time_speed_routes");

                entity.HasComment("Cached route touch")
                    .UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.CompleteId, "complete_id");

                entity.Property(e => e.CompleteId).HasColumnName("complete_id");

                entity.Property(e => e.Index).HasColumnName("index");

                entity.Property(e => e.RouteIds)
                    .HasColumnType("mediumtext")
                    .HasColumnName("route_ids");

                entity.Property(e => e.SummaryTime).HasColumnName("summary_time");

                entity.HasOne(d => d.Complete)
                    .WithMany()
                    .HasForeignKey(d => d.CompleteId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_triggers_time_speed_routes_strafes_complete");
            });

            modelBuilder.Entity<TriggersTimeSpeedTouch>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("triggers_time_speed_touch");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.CompleteId, "complete_id");

                entity.HasIndex(e => e.TriggerBeforeId, "trigger_before_id");

                entity.HasIndex(e => e.TriggerId, "trigger_id");

                entity.Property(e => e.CompleteId).HasColumnName("complete_id");

                entity.Property(e => e.SpeedBeforeMax).HasColumnName("speed_before_max");

                entity.Property(e => e.SpeedDuringMax).HasColumnName("speed_during_max");

                entity.Property(e => e.SpeedEnd).HasColumnName("speed_end");

                entity.Property(e => e.SpeedStart).HasColumnName("speed_start");

                entity.Property(e => e.TimeBefore).HasColumnName("time_before");

                entity.Property(e => e.TimeDuring).HasColumnName("time_during");

                entity.Property(e => e.TriggerBeforeId).HasColumnName("trigger_before_id");

                entity.Property(e => e.TriggerId).HasColumnName("trigger_id");

                entity.HasOne(d => d.Complete)
                    .WithMany()
                    .HasForeignKey(d => d.CompleteId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_triggers_time_speed_touch_strafes_complete");

                entity.HasOne(d => d.TriggerBefore)
                    .WithMany()
                    .HasForeignKey(d => d.TriggerBeforeId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_triggers_time_speed_touch_strafes_triggers");

                entity.HasOne(d => d.Trigger)
                    .WithMany()
                    .HasForeignKey(d => d.TriggerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_triggers_time_speed_touch_strafes_triggers_2");
            });

            modelBuilder.Entity<Twr>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("twr");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.HasIndex(e => e.CompleteId, "complete_id");

                entity.HasIndex(e => e.TrickId, "trick_id");

                entity.Property(e => e.CompleteId).HasColumnName("complete_id");

                entity.Property(e => e.TrickId).HasColumnName("trick_id");

                entity.HasOne(d => d.Complete)
                    .WithMany()
                    .HasForeignKey(d => d.CompleteId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_twr_strafes_complete");

                entity.HasOne(d => d.Trick)
                    .WithMany()
                    .HasForeignKey(d => d.TrickId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_strafes_twr_strafes_tricks");
            });

            modelBuilder.Entity<TwrUpdate>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("twr_update");

                entity.HasIndex(e => e.BeforeWr, "before_wr");

                entity.HasIndex(e => e.NowWr, "now_wr");

                entity.Property(e => e.BeforeWr).HasColumnName("before_wr");

                entity.Property(e => e.NowWr).HasColumnName("now_wr");

                entity.HasOne(d => d.BeforeWrNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.BeforeWr)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_twr_update_completes_2");

                entity.HasOne(d => d.NowWrNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.NowWr)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_twr_update_completes_1");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.UseCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AvatarCustom)
                    .HasMaxLength(50)
                    .HasColumnName("avatarCustom");

                entity.Property(e => e.Avatarfull)
                    .HasMaxLength(50)
                    .HasColumnName("avatarfull");

                entity.Property(e => e.Dashboard)
                    .HasMaxLength(50)
                    .HasColumnName("dashboard");

                entity.Property(e => e.DateReg)
                    .HasColumnType("timestamp")
                    .HasColumnName("date_reg")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.LastLogin)
                    .HasColumnType("timestamp")
                    .HasColumnName("last_login")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Profileurl)
                    .HasMaxLength(50)
                    .HasColumnName("profileurl");

                entity.Property(e => e.Role)
                    .HasColumnType("enum('user','premium','admin')")
                    .HasColumnName("role");

                entity.Property(e => e.Steamid64)
                    .HasMaxLength(50)
                    .HasColumnName("steamid64");

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .HasColumnName("username");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
