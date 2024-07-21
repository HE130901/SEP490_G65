using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace cms_server.Models;

public partial class CmsContext : DbContext
{
    public CmsContext()
    {
    }

    public CmsContext(DbContextOptions<CmsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<Building> Buildings { get; set; }

    public virtual DbSet<Contract> Contracts { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Deceased> Deceaseds { get; set; }

    public virtual DbSet<Floor> Floors { get; set; }

    public virtual DbSet<Niche> Niches { get; set; }

    public virtual DbSet<NicheHistory> NicheHistories { get; set; }

    public virtual DbSet<NicheReservation> NicheReservations { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<ServiceOrder> ServiceOrders { get; set; }

    public virtual DbSet<ServiceOrderDetail> ServiceOrderDetails { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<VisitRegistration> VisitRegistrations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Create a configuration builder
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            // Get the connection string from the configuration
            var connectionString = configuration.GetConnectionString("RemoteDB");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__Area__70B820284C49E312");

            entity.ToTable("Area");

            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.AreaName).HasMaxLength(255);
            entity.Property(e => e.FloorId).HasColumnName("FloorID");

            entity.HasOne(d => d.Floor).WithMany(p => p.Areas)
                .HasForeignKey(d => d.FloorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Area__FloorID__5441852A");
        });

        modelBuilder.Entity<Building>(entity =>
        {
            entity.HasKey(e => e.BuildingId).HasName("PK__Building__5463CDE4225A9528");

            entity.ToTable("Building");

            entity.Property(e => e.BuildingId).HasColumnName("BuildingID");
            entity.Property(e => e.BuildingName).HasMaxLength(255);
        });

        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PK__Contract__C90D340960DCAD91");

            entity.ToTable("Contract");

            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.Customer).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__Custom__5535A963");

            entity.HasOne(d => d.Deceased).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.DeceasedId)
                .HasConstraintName("FK__Contract__Deceas__5629CD9C");

            entity.HasOne(d => d.Niche).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__NicheI__571DF1D5");

            entity.HasOne(d => d.Staff).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__StaffI__5812160E");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B8DA5F25DA");

            entity.ToTable("Customer");

            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CitizenId)
                .HasMaxLength(50)
                .HasColumnName("CitizenID");
            entity.Property(e => e.CitizenIdissuanceDate).HasColumnName("CitizenIDIssuanceDate");
            entity.Property(e => e.CitizenIdsupplier)
                .HasMaxLength(200)
                .HasColumnName("CitizenIDSupplier");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(50);
        });

        modelBuilder.Entity<Deceased>(entity =>
        {
            entity.HasKey(e => e.DeceasedId).HasName("PK__Deceased__E7DB31FDD77C7EF0");

            entity.ToTable("Deceased");

            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.CitizenId)
                .HasMaxLength(50)
                .HasColumnName("CitizenID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeathCertificateNumber).HasMaxLength(200);
            entity.Property(e => e.DeathCertificateSupplier).HasMaxLength(200);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.RelationshipWithCusomer).HasMaxLength(50);

            entity.HasOne(d => d.Customer).WithMany(p => p.Deceaseds)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Deceased__Custom__59063A47");

            entity.HasOne(d => d.Niche).WithMany(p => p.Deceaseds)
                .HasForeignKey(d => d.NicheId)
                .HasConstraintName("FK__Deceased__NicheI__59FA5E80");
        });

        modelBuilder.Entity<Floor>(entity =>
        {
            entity.HasKey(e => e.FloorId).HasName("PK__Floor__49D1E86B33831430");

            entity.ToTable("Floor");

            entity.Property(e => e.FloorId).HasColumnName("FloorID");
            entity.Property(e => e.BuildingId).HasColumnName("BuildingID");
            entity.Property(e => e.FloorName).HasMaxLength(255);
            entity.Property(e => e.NichePrice).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.Building).WithMany(p => p.Floors)
                .HasForeignKey(d => d.BuildingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Floor__BuildingI__5AEE82B9");
        });

        modelBuilder.Entity<Niche>(entity =>
        {
            entity.HasKey(e => e.NicheId).HasName("PK__Niche__57FA5922A8BB0DB7");

            entity.ToTable("Niche");

            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.NicheName).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Area).WithMany(p => p.Niches)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Niche__AreaID__5BE2A6F2");
        });

        modelBuilder.Entity<NicheHistory>(entity =>
        {
            entity.HasKey(e => e.NicheHistoryId).HasName("PK__NicheHis__0ACA3FC868642BA6");

            entity.ToTable("NicheHistory");

            entity.Property(e => e.NicheHistoryId).HasColumnName("NicheHistoryID");
            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Contract).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.ContractId)
                .HasConstraintName("FK__NicheHist__Contr__5CD6CB2B");

            entity.HasOne(d => d.Customer).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheHist__Custo__5DCAEF64");

            entity.HasOne(d => d.Deceased).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.DeceasedId)
                .HasConstraintName("FK__NicheHist__Decea__5EBF139D");

            entity.HasOne(d => d.Niche).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheHist__Niche__5FB337D6");
        });

        modelBuilder.Entity<NicheReservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__NicheRes__B7EE5F046AFACE5C");

            entity.ToTable("NicheReservation");

            entity.Property(e => e.ReservationId).HasColumnName("ReservationID");
            entity.Property(e => e.ConfirmationDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.PhoneNumber).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.ConfirmedByNavigation).WithMany(p => p.NicheReservations)
                .HasForeignKey(d => d.ConfirmedBy)
                .HasConstraintName("FK_NicheReservation_Staff");

            entity.HasOne(d => d.Niche).WithMany(p => p.NicheReservations)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheRese__Niche__60A75C0F");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E3289B3511C");

            entity.ToTable("Notification");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.NotificationDate).HasColumnType("datetime");
            entity.Property(e => e.ServiceOrderId).HasColumnName("ServiceOrderID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.VisitId).HasColumnName("VisitID");

            entity.HasOne(d => d.Contract).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ContractId)
                .HasConstraintName("FK__Notificat__Contr__619B8048");

            entity.HasOne(d => d.Customer).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Notificat__Custo__628FA481");

            entity.HasOne(d => d.ServiceOrder).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ServiceOrderId)
                .HasConstraintName("FK__Notificat__Servi__6383C8BA");

            entity.HasOne(d => d.Staff).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Notificat__Staff__6477ECF3");

            entity.HasOne(d => d.Visit).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.VisitId)
                .HasConstraintName("FK__Notificat__Visit__656C112C");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Report__D5BD48E5E66A4FF6");

            entity.ToTable("Report");

            entity.Property(e => e.ReportId).HasColumnName("ReportID");
            entity.Property(e => e.GeneratedDate).HasColumnType("datetime");
            entity.Property(e => e.ReportType).HasMaxLength(255);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB0EAC8639B97");

            entity.ToTable("Service");

            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ServiceName).HasMaxLength(255);
        });

        modelBuilder.Entity<ServiceOrder>(entity =>
        {
            entity.HasKey(e => e.ServiceOrderId).HasName("PK__ServiceO__8E1ABD057DD58268");

            entity.ToTable("ServiceOrder");

            entity.Property(e => e.ServiceOrderId).HasColumnName("ServiceOrderID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.ServiceOrderCode).HasMaxLength(15);
            entity.Property(e => e.StaffId).HasColumnName("StaffID");

            entity.HasOne(d => d.Customer).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Custo__66603565");

            entity.HasOne(d => d.Niche).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Niche__6754599E");

            entity.HasOne(d => d.Staff).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__ServiceOr__Staff__68487DD7");
        });

        modelBuilder.Entity<ServiceOrderDetail>(entity =>
        {
            entity.HasKey(e => e.ServiceOrderDetailId).HasName("PK__ServiceO__92D8F3228DC63952");

            entity.ToTable("ServiceOrderDetail");

            entity.Property(e => e.ServiceOrderDetailId).HasColumnName("ServiceOrderDetailID");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.ServiceOrderId).HasColumnName("ServiceOrderID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Service).WithMany(p => p.ServiceOrderDetails)
                .HasForeignKey(d => d.ServiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Servi__6A30C649");

            entity.HasOne(d => d.ServiceOrder).WithMany(p => p.ServiceOrderDetails)
                .HasForeignKey(d => d.ServiceOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Servi__693CA210");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF7887359FB");

            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<VisitRegistration>(entity =>
        {
            entity.HasKey(e => e.VisitId).HasName("PK__VisitReg__4D3AA1BEAA891E47");

            entity.ToTable("VisitRegistration");

            entity.Property(e => e.VisitId).HasColumnName("VisitID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.VisitDate).HasColumnType("datetime");

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK__VisitRegi__Appro__6B24EA82");

            entity.HasOne(d => d.Customer).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitRegi__Custo__6C190EBB");

            entity.HasOne(d => d.Niche).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitRegi__Niche__6D0D32F4");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
