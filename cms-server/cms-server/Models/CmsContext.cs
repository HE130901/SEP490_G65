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

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<VisitRegistration> VisitRegistrations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=trunghieu;Initial Catalog=cms;Integrated Security=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__Area__70B8202833967EDF");

            entity.ToTable("Area");

            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.AreaName).HasMaxLength(255);
            entity.Property(e => e.FloorId).HasColumnName("FloorID");

            entity.HasOne(d => d.Floor).WithMany(p => p.Areas)
                .HasForeignKey(d => d.FloorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Area__FloorID__4316F928");
        });

        modelBuilder.Entity<Building>(entity =>
        {
            entity.HasKey(e => e.BuildingId).HasName("PK__Building__5463CDE45A9526A8");

            entity.ToTable("Building");

            entity.Property(e => e.BuildingId).HasColumnName("BuildingID");
            entity.Property(e => e.BuildingName).HasMaxLength(255);
        });

        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PK__Contract__C90D340913D325C9");

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
                .HasConstraintName("FK__Contract__Custom__4F7CD00D");

            entity.HasOne(d => d.Deceased).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.DeceasedId)
                .HasConstraintName("FK__Contract__Deceas__52593CB8");

            entity.HasOne(d => d.Niche).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__NicheI__5165187F");

            entity.HasOne(d => d.Staff).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contract__StaffI__5070F446");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B8F5A8DB28");

            entity.ToTable("Customer");

            entity.HasIndex(e => e.CitizenId, "UQ__Customer__6E49FBED6D50E148").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Customer__A9D10534A4A24140").IsUnique();

            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.AccountStatus)
                .HasMaxLength(50)
                .HasDefaultValue("Guest");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CitizenId)
                .HasMaxLength(50)
                .HasColumnName("CitizenID");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(50);
        });

        modelBuilder.Entity<Deceased>(entity =>
        {
            entity.HasKey(e => e.DeceasedId).HasName("PK__Deceased__E7DB31FDA66CD697");

            entity.ToTable("Deceased");

            entity.HasIndex(e => e.CitizenId, "UQ__Deceased__6E49FBEDCFA639A5").IsUnique();

            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.CitizenId)
                .HasMaxLength(50)
                .HasColumnName("CitizenID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.NicheId).HasColumnName("NicheID");

            entity.HasOne(d => d.Customer).WithMany(p => p.Deceaseds)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Deceased__Custom__4AB81AF0");

            entity.HasOne(d => d.Niche).WithMany(p => p.Deceaseds)
                .HasForeignKey(d => d.NicheId)
                .HasConstraintName("FK__Deceased__NicheI__49C3F6B7");
        });

        modelBuilder.Entity<Floor>(entity =>
        {
            entity.HasKey(e => e.FloorId).HasName("PK__Floor__49D1E86B53451A05");

            entity.ToTable("Floor");

            entity.Property(e => e.FloorId).HasColumnName("FloorID");
            entity.Property(e => e.BuildingId).HasColumnName("BuildingID");
            entity.Property(e => e.FloorName).HasMaxLength(255);
            entity.Property(e => e.NichePrice).HasColumnType("decimal(18, 0)");

            entity.HasOne(d => d.Building).WithMany(p => p.Floors)
                .HasForeignKey(d => d.BuildingId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Floor__BuildingI__403A8C7D");
        });

        modelBuilder.Entity<Niche>(entity =>
        {
            entity.HasKey(e => e.NicheId).HasName("PK__Niche__57FA592268932D67");

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
                .HasConstraintName("FK__Niche__AreaID__45F365D3");
        });

        modelBuilder.Entity<NicheHistory>(entity =>
        {
            entity.HasKey(e => e.NicheHistoryId).HasName("PK__NicheHis__0ACA3FC865A6A616");

            entity.ToTable("NicheHistory");

            entity.Property(e => e.NicheHistoryId).HasColumnName("NicheHistoryID");
            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DeceasedId).HasColumnName("DeceasedID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");

            entity.HasOne(d => d.Contract).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.ContractId)
                .HasConstraintName("FK__NicheHist__Contr__6EF57B66");

            entity.HasOne(d => d.Customer).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheHist__Custo__6D0D32F4");

            entity.HasOne(d => d.Deceased).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.DeceasedId)
                .HasConstraintName("FK__NicheHist__Decea__6E01572D");

            entity.HasOne(d => d.Niche).WithMany(p => p.NicheHistories)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheHist__Niche__6C190EBB");
        });

        modelBuilder.Entity<NicheReservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__NicheRes__B7EE5F0480CBA33C");

            entity.ToTable("NicheReservation");

            entity.Property(e => e.ReservationId).HasColumnName("ReservationID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.ConfirmedByNavigation).WithMany(p => p.NicheReservations)
                .HasForeignKey(d => d.ConfirmedBy)
                .HasConstraintName("FK__NicheRese__Confi__628FA481");

            entity.HasOne(d => d.Customer).WithMany(p => p.NicheReservations)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheRese__Custo__60A75C0F");

            entity.HasOne(d => d.Niche).WithMany(p => p.NicheReservations)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NicheRese__Niche__619B8048");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E32F85F0C9B");

            entity.ToTable("Notification");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.ContractId).HasColumnName("ContractID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.ServiceOrderId).HasColumnName("ServiceOrderID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.VisitId).HasColumnName("VisitID");

            entity.HasOne(d => d.Contract).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ContractId)
                .HasConstraintName("FK__Notificat__Contr__6754599E");

            entity.HasOne(d => d.Customer).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Notificat__Custo__656C112C");

            entity.HasOne(d => d.ServiceOrder).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.ServiceOrderId)
                .HasConstraintName("FK__Notificat__Servi__68487DD7");

            entity.HasOne(d => d.Staff).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__Notificat__Staff__66603565");

            entity.HasOne(d => d.Visit).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.VisitId)
                .HasConstraintName("FK__Notificat__Visit__693CA210");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Report__D5BD48E5D34F7A71");

            entity.ToTable("Report");

            entity.Property(e => e.ReportId).HasColumnName("ReportID");
            entity.Property(e => e.ReportType).HasMaxLength(255);
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB0EA6C1AD3C3");

            entity.ToTable("Service");

            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ServiceName).HasMaxLength(255);
        });

        modelBuilder.Entity<ServiceOrder>(entity =>
        {
            entity.HasKey(e => e.ServiceOrderId).HasName("PK__ServiceO__8E1ABD053E54D013");

            entity.ToTable("ServiceOrder");

            entity.Property(e => e.ServiceOrderId).HasColumnName("ServiceOrderID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Customer).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Custo__5535A963");

            entity.HasOne(d => d.Niche).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServiceOr__Niche__5629CD9C");

            entity.HasOne(d => d.Staff).WithMany(p => p.ServiceOrders)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__ServiceOr__Staff__571DF1D5");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF740AC98F1");

            entity.HasIndex(e => e.Email, "UQ__Staff__A9D105347F9AE145").IsUnique();

            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<VisitRegistration>(entity =>
        {
            entity.HasKey(e => e.VisitId).HasName("PK__VisitReg__4D3AA1BE96500404");

            entity.ToTable("VisitRegistration");

            entity.Property(e => e.VisitId).HasColumnName("VisitID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.NicheId).HasColumnName("NicheID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK__VisitRegi__Appro__5BE2A6F2");

            entity.HasOne(d => d.Customer).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitRegi__Custo__59FA5E80");

            entity.HasOne(d => d.Niche).WithMany(p => p.VisitRegistrations)
                .HasForeignKey(d => d.NicheId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitRegi__Niche__5AEE82B9");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
