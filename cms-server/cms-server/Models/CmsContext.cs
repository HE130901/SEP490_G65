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

    public virtual DbSet<ContractRenew> ContractRenews { get; set; }

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

    public virtual DbSet<SystemSetting> SystemSettings { get; set; }

    public virtual DbSet<VisitRegistration> VisitRegistrations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=tcp:sep490g65.database.windows.net,1433;Initial Catalog=cms;Persist Security Info=False;User ID=trunghieu;Password=Concho@2024;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__Area__70B820288BD97E85");

            entity.ToTable("Area");

            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.AreaCode).HasMaxLength(50);
            entity.Property(e => e.AreaName).HasMaxLength(255);
            entity.Property(e => e.FloorId).HasColumnName("FloorID");

            entity.HasOne(d => d.Floor).WithMany(p => p.Areas)
                .HasForeignKey(d => d.FloorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Area__FloorID__7B5B524B");
        });

        modelBuilder.Entity<Building>(entity =>
        {
            entity.HasKey(e => e.BuildingId).HasName("PK__Building__5463CDE41BC64FD8");

            entity.ToTable("Building");

            entity.Property(e => e.BuildingId).HasColumnName("BuildingID");
            entity.Property(e => e.BuildingCode).HasMaxLength(50);
            entity.Property(e => e.BuildingName).HasMaxLength(255);
        });

        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PK__Contract__C90D3409142CADC8");

            entity.ToTable("Contract");

            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.ContractCode).HasMaxLength(50);
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.Customer).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__Custom__7C4F7684");

            entity.HasOne(d => d.Deceased).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.DeceasedId)
                .HasConstraintName("FK__Contract__Deceas__7D439ABD");

            entity.HasOne(d => d.Niche).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__NicheI__7E37BEF6");

            entity.HasOne(d => d.Staff).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__StaffI__7F2BE32F");
        });

        modelBuilder.Entity<ContractRenew>(entity =>
        {
            entity.HasKey(e => e.ContractRenewId).HasName("PK__Contract__F98F8D426B22F636");

            entity.ToTable("ContractRenew");

            entity.Property(e => e.ContractRenewCode).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Contract).WithMany(p => p.ContractRenews)
                .HasForeignKey(d => d.ContractId)
                .HasConstraintName("FK__ContractR__Contr__00200768");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B8F97C40B0");

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
            entity.HasKey(e => e.DeceasedId).HasName("PK__Deceased__E7DB31FD97C65DAB");

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
                .HasConstraintName("FK__Deceased__Custom__01142BA1");

            entity.HasOne(d => d.Niche).WithMany(p => p.Deceaseds)
                .HasForeignKey(d => d.NicheId)
                .HasConstraintName("FK__Deceased__NicheI__02084FDA");
        });

        modelBuilder.Entity<Floor>(entity =>
        {
            entity.HasKey(e => e.FloorId).HasName("PK__Floor__49D1E86BEE6AD984");

            entity.ToTable("Floor");

            entity.Property(e => e.FloorId).HasColumnName("FloorID");
            entity.Property(e => e.BuildingId).HasColumnName("BuildingID");
            entity.Property(e => e.FloorCode).HasMaxLength(50);
            entity.Property(e => e.FloorName).HasMaxLength(255);

            entity.HasOne(d => d.Building).WithMany(p => p.Floors)
                .HasForeignKey(d => d.BuildingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Floor__BuildingI__02FC7413");
        });

        modelBuilder.Entity<Niche>(entity =>
        {
            entity.HasKey(e => e.NicheId).HasName("PK__Niche__57FA5922BCAF304A");

            entity.ToTable("Niche");

            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.NicheCode).HasMaxLength(50);
            entity.Property(e => e.NicheName).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Area).WithMany(p => p.Niches)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Niche__AreaID__03F0984C");
        });

        modelBuilder.Entity<NicheHistory>(entity =>
        {
            entity.HasKey(e => e.NicheHistoryId).HasName("PK__NicheHis__0ACA3FC896CD45EC");

            entity.ToTable("NicheHistory");

            entity.Property(e => e.NicheHistoryId).HasColumnName("NicheHistoryID");
            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Contract).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.ContractId)
                .HasConstraintName("FK__NicheHist__Contr__04E4BC85");

            entity.HasOne(d => d.Customer).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheHist__Custo__05D8E0BE");

            entity.HasOne(d => d.Deceased).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.DeceasedId)
                .HasConstraintName("FK__NicheHist__Decea__06CD04F7");

            entity.HasOne(d => d.Niche).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheHist__Niche__07C12930");
        });

        modelBuilder.Entity<NicheReservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__NicheRes__B7EE5F0495C5EE32");

            entity.ToTable("NicheReservation");

            entity.Property(e => e.ReservationId).HasColumnName("ReservationID");
            entity.Property(e => e.ConfirmationDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.PhoneNumber).HasMaxLength(50);
            entity.Property(e => e.ReservationCode).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.ConfirmedByNavigation).WithMany(p => p.NicheReservations)
                .HasForeignKey(d => d.ConfirmedBy)
                .HasConstraintName("FK_NicheReservation_Staff");

            entity.HasOne(d => d.Niche).WithMany(p => p.NicheReservations)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheRese__Niche__08B54D69");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E328BF916AA");

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
                .HasConstraintName("FK__Notificat__Contr__0A9D95DB");

            entity.HasOne(d => d.Customer).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Notificat__Custo__0B91BA14");

            entity.HasOne(d => d.ServiceOrder).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ServiceOrderId)
                .HasConstraintName("FK__Notificat__Servi__0C85DE4D");

            entity.HasOne(d => d.Staff).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Notificat__Staff__0D7A0286");

            entity.HasOne(d => d.Visit).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.VisitId)
                .HasConstraintName("FK__Notificat__Visit__0E6E26BF");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Report__D5BD48E5F7059A3E");

            entity.ToTable("Report");

            entity.Property(e => e.ReportId).HasColumnName("ReportID");
            entity.Property(e => e.GeneratedDate).HasColumnType("datetime");
            entity.Property(e => e.ReportCode).HasMaxLength(50);
            entity.Property(e => e.ReportType).HasMaxLength(255);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB0EA252B22BB");

            entity.ToTable("Service");

            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ServiceName).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<ServiceOrder>(entity =>
        {
            entity.HasKey(e => e.ServiceOrderId).HasName("PK__ServiceO__8E1ABD05A03BA898");

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
                .HasConstraintName("FK__ServiceOr__Custo__0F624AF8");

            entity.HasOne(d => d.Niche).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Niche__10566F31");

            entity.HasOne(d => d.Staff).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__ServiceOr__Staff__114A936A");
        });

        modelBuilder.Entity<ServiceOrderDetail>(entity =>
        {
            entity.HasKey(e => e.ServiceOrderDetailId).HasName("PK__ServiceO__92D8F3228D9B7AD1");

            entity.ToTable("ServiceOrderDetail");

            entity.Property(e => e.ServiceOrderDetailId).HasColumnName("ServiceOrderDetailID");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.ServiceOrderId).HasColumnName("ServiceOrderID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Service).WithMany(p => p.ServiceOrderDetails)
                .HasForeignKey(d => d.ServiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Servi__1332DBDC");

            entity.HasOne(d => d.ServiceOrder).WithMany(p => p.ServiceOrderDetails)
                .HasForeignKey(d => d.ServiceOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Servi__123EB7A3");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF7E2C7A5C7");

            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.HasKey(e => e.SettingId);

            entity.ToTable("SystemSetting");

            entity.Property(e => e.SettingId).ValueGeneratedNever();
            entity.Property(e => e.SettingName).HasMaxLength(50);
            entity.Property(e => e.SettingNumber).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.SettingType).HasMaxLength(50);
            entity.Property(e => e.SettingUnit).HasMaxLength(50);
        });

        modelBuilder.Entity<VisitRegistration>(entity =>
        {
            entity.HasKey(e => e.VisitId).HasName("PK__VisitReg__4D3AA1BE6D23F594");

            entity.ToTable("VisitRegistration");

            entity.Property(e => e.VisitId).HasColumnName("VisitID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.VisitCode).HasMaxLength(50);
            entity.Property(e => e.VisitDate).HasColumnType("datetime");

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK__VisitRegi__Appro__14270015");

            entity.HasOne(d => d.Customer).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitRegi__Custo__151B244E");

            entity.HasOne(d => d.Niche).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitRegi__Niche__160F4887");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
