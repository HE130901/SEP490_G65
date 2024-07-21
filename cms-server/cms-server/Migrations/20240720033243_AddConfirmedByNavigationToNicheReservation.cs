using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cms_server.Migrations
{
    /// <inheritdoc />
    public partial class AddConfirmedByNavigationToNicheReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Building",
                columns: table => new
                {
                    BuildingID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuildingName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    BuildingDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuildingPicture = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Building__5463CDE47FC5507E", x => x.BuildingID);
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    CustomerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CitizenID = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CitizenIDIssuanceDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CitizenIDSupplier = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__A4AE64B859788EC1", x => x.CustomerID);
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    ReportID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    GeneratedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Report__D5BD48E5126CC1D2", x => x.ReportID);
                });

            migrationBuilder.CreateTable(
                name: "Service",
                columns: table => new
                {
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    ServicePicture = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tag = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Service__C51BB0EA3C1B2E72", x => x.ServiceID);
                });

            migrationBuilder.CreateTable(
                name: "Staff",
                columns: table => new
                {
                    StaffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Staff__96D4AAF7F7D131D5", x => x.StaffID);
                });

            migrationBuilder.CreateTable(
                name: "Floor",
                columns: table => new
                {
                    FloorID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuildingID = table.Column<int>(type: "int", nullable: false),
                    FloorName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FloorDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NichePrice = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    FloorPicture = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Floor__49D1E86B1B8A3F1A", x => x.FloorID);
                    table.ForeignKey(
                        name: "FK__Floor__BuildingI__6383C8BA",
                        column: x => x.BuildingID,
                        principalTable: "Building",
                        principalColumn: "BuildingID");
                });

            migrationBuilder.CreateTable(
                name: "Area",
                columns: table => new
                {
                    AreaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FloorID = table.Column<int>(type: "int", nullable: false),
                    AreaName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AreaDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AreaPicture = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Area__70B820282FEB4332", x => x.AreaID);
                    table.ForeignKey(
                        name: "FK__Area__FloorID__5CD6CB2B",
                        column: x => x.FloorID,
                        principalTable: "Floor",
                        principalColumn: "FloorID");
                });

            migrationBuilder.CreateTable(
                name: "Niche",
                columns: table => new
                {
                    NicheID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AreaID = table.Column<int>(type: "int", nullable: false),
                    NicheName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NicheDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CustomerID = table.Column<int>(type: "int", nullable: true),
                    DeceasedID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Niche__57FA59229B329836", x => x.NicheID);
                    table.ForeignKey(
                        name: "FK__Niche__AreaID__6477ECF3",
                        column: x => x.AreaID,
                        principalTable: "Area",
                        principalColumn: "AreaID");
                });

            migrationBuilder.CreateTable(
                name: "Deceased",
                columns: table => new
                {
                    DeceasedID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CitizenID = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: true),
                    DateOfDeath = table.Column<DateOnly>(type: "date", nullable: true),
                    NicheID = table.Column<int>(type: "int", nullable: true),
                    CustomerID = table.Column<int>(type: "int", nullable: true),
                    DeathCertificateNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeathCertificateSupplier = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    RelationshipWithCusomer = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Deceased__E7DB31FD16B025FA", x => x.DeceasedID);
                    table.ForeignKey(
                        name: "FK__Deceased__Custom__619B8048",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID");
                    table.ForeignKey(
                        name: "FK__Deceased__NicheI__628FA481",
                        column: x => x.NicheID,
                        principalTable: "Niche",
                        principalColumn: "NicheID");
                });

            migrationBuilder.CreateTable(
                name: "NicheReservation",
                columns: table => new
                {
                    ReservationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NicheID = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    ConfirmationDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SignAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConfirmedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NicheRes__B7EE5F0404A73A4A", x => x.ReservationID);
                    table.ForeignKey(
                        name: "FK__NicheRese__ConfirmedBy__6C190EBB",
                        column: x => x.ConfirmedBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__NicheRese__Niche__693CA210",
                        column: x => x.NicheID,
                        principalTable: "Niche",
                        principalColumn: "NicheID");
                });

            migrationBuilder.CreateTable(
                name: "ServiceOrder",
                columns: table => new
                {
                    ServiceOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    NicheID = table.Column<int>(type: "int", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    ServiceOrderCode = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true, defaultValueSql: "(left(CONVERT([nvarchar](36),newid()),(15)))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ServiceO__8E1ABD0581438783", x => x.ServiceOrderID);
                    table.ForeignKey(
                        name: "FK__ServiceOr__Custo__6EF57B66",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID");
                    table.ForeignKey(
                        name: "FK__ServiceOr__Niche__6FE99F9F",
                        column: x => x.NicheID,
                        principalTable: "Niche",
                        principalColumn: "NicheID");
                    table.ForeignKey(
                        name: "FK__ServiceOr__Staff__70DDC3D8",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                });

            migrationBuilder.CreateTable(
                name: "VisitRegistration",
                columns: table => new
                {
                    VisitID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    NicheID = table.Column<int>(type: "int", nullable: false),
                    VisitDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccompanyingPeople = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__VisitReg__4D3AA1BE3DB80515", x => x.VisitID);
                    table.ForeignKey(
                        name: "FK__VisitRegi__Appro__73BA3083",
                        column: x => x.ApprovedBy,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__VisitRegi__Custo__74AE54BC",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID");
                    table.ForeignKey(
                        name: "FK__VisitRegi__Niche__75A278F5",
                        column: x => x.NicheID,
                        principalTable: "Niche",
                        principalColumn: "NicheID");
                });

            migrationBuilder.CreateTable(
                name: "Contract",
                columns: table => new
                {
                    ContractID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    StaffID = table.Column<int>(type: "int", nullable: false),
                    NicheID = table.Column<int>(type: "int", nullable: false),
                    DeceasedID = table.Column<int>(type: "int", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,0)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Contract__C90D340952B816AC", x => x.ContractID);
                    table.ForeignKey(
                        name: "FK__Contract__Custom__5DCAEF64",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID");
                    table.ForeignKey(
                        name: "FK__Contract__Deceas__5EBF139D",
                        column: x => x.DeceasedID,
                        principalTable: "Deceased",
                        principalColumn: "DeceasedID");
                    table.ForeignKey(
                        name: "FK__Contract__NicheI__5FB337D6",
                        column: x => x.NicheID,
                        principalTable: "Niche",
                        principalColumn: "NicheID");
                    table.ForeignKey(
                        name: "FK__Contract__StaffI__60A75C0F",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                });

            migrationBuilder.CreateTable(
                name: "ServiceOrderDetail",
                columns: table => new
                {
                    ServiceOrderDetailID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceOrderID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CompletionImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ServiceO__92D8F322BE359A85", x => x.ServiceOrderDetailID);
                    table.ForeignKey(
                        name: "FK__ServiceOr__Servi__71D1E811",
                        column: x => x.ServiceOrderID,
                        principalTable: "ServiceOrder",
                        principalColumn: "ServiceOrderID");
                    table.ForeignKey(
                        name: "FK__ServiceOr__Servi__72C60C4A",
                        column: x => x.ServiceID,
                        principalTable: "Service",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateTable(
                name: "NicheHistory",
                columns: table => new
                {
                    NicheHistoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NicheID = table.Column<int>(type: "int", nullable: false),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    DeceasedID = table.Column<int>(type: "int", nullable: true),
                    ContractID = table.Column<int>(type: "int", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NicheHis__0ACA3FC8745DB891", x => x.NicheHistoryID);
                    table.ForeignKey(
                        name: "FK__NicheHist__Contr__656C112C",
                        column: x => x.ContractID,
                        principalTable: "Contract",
                        principalColumn: "ContractID");
                    table.ForeignKey(
                        name: "FK__NicheHist__Custo__66603565",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID");
                    table.ForeignKey(
                        name: "FK__NicheHist__Decea__6754599E",
                        column: x => x.DeceasedID,
                        principalTable: "Deceased",
                        principalColumn: "DeceasedID");
                    table.ForeignKey(
                        name: "FK__NicheHist__Niche__68487DD7",
                        column: x => x.NicheID,
                        principalTable: "Niche",
                        principalColumn: "NicheID");
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    NotificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: true),
                    StaffID = table.Column<int>(type: "int", nullable: true),
                    ContractID = table.Column<int>(type: "int", nullable: true),
                    ServiceOrderID = table.Column<int>(type: "int", nullable: true),
                    VisitID = table.Column<int>(type: "int", nullable: true),
                    NotificationDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Notifica__20CF2E321630E339", x => x.NotificationID);
                    table.ForeignKey(
                        name: "FK__Notificat__Contr__6A30C649",
                        column: x => x.ContractID,
                        principalTable: "Contract",
                        principalColumn: "ContractID");
                    table.ForeignKey(
                        name: "FK__Notificat__Custo__6B24EA82",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID");
                    table.ForeignKey(
                        name: "FK__Notificat__Servi__6C190EBB",
                        column: x => x.ServiceOrderID,
                        principalTable: "ServiceOrder",
                        principalColumn: "ServiceOrderID");
                    table.ForeignKey(
                        name: "FK__Notificat__Staff__6D0D32F4",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "StaffID");
                    table.ForeignKey(
                        name: "FK__Notificat__Visit__6E01572D",
                        column: x => x.VisitID,
                        principalTable: "VisitRegistration",
                        principalColumn: "VisitID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Area_FloorID",
                table: "Area",
                column: "FloorID");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_CustomerID",
                table: "Contract",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_DeceasedID",
                table: "Contract",
                column: "DeceasedID");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_NicheID",
                table: "Contract",
                column: "NicheID");

            migrationBuilder.CreateIndex(
                name: "IX_Contract_StaffID",
                table: "Contract",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__6E49FBEDEF910C9B",
                table: "Customer",
                column: "CitizenID",
                unique: true,
                filter: "[CitizenID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__A9D10534D6DC3CFC",
                table: "Customer",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Deceased_CustomerID",
                table: "Deceased",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Deceased_NicheID",
                table: "Deceased",
                column: "NicheID");

            migrationBuilder.CreateIndex(
                name: "UQ__Deceased__6E49FBED064ED074",
                table: "Deceased",
                column: "CitizenID",
                unique: true,
                filter: "[CitizenID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Floor_BuildingID",
                table: "Floor",
                column: "BuildingID");

            migrationBuilder.CreateIndex(
                name: "IX_Niche_AreaID",
                table: "Niche",
                column: "AreaID");

            migrationBuilder.CreateIndex(
                name: "IX_NicheHistory_ContractID",
                table: "NicheHistory",
                column: "ContractID");

            migrationBuilder.CreateIndex(
                name: "IX_NicheHistory_CustomerID",
                table: "NicheHistory",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_NicheHistory_DeceasedID",
                table: "NicheHistory",
                column: "DeceasedID");

            migrationBuilder.CreateIndex(
                name: "IX_NicheHistory_NicheID",
                table: "NicheHistory",
                column: "NicheID");

            migrationBuilder.CreateIndex(
                name: "IX_NicheReservation_ConfirmedBy",
                table: "NicheReservation",
                column: "ConfirmedBy");

            migrationBuilder.CreateIndex(
                name: "IX_NicheReservation_NicheID",
                table: "NicheReservation",
                column: "NicheID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_ContractID",
                table: "Notification",
                column: "ContractID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_CustomerID",
                table: "Notification",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_ServiceOrderID",
                table: "Notification",
                column: "ServiceOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_StaffID",
                table: "Notification",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_VisitID",
                table: "Notification",
                column: "VisitID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrder_CustomerID",
                table: "ServiceOrder",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrder_NicheID",
                table: "ServiceOrder",
                column: "NicheID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrder_StaffID",
                table: "ServiceOrder",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "UQ_ServiceOrderCode",
                table: "ServiceOrder",
                column: "ServiceOrderCode",
                unique: true,
                filter: "[ServiceOrderCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDetail_ServiceID",
                table: "ServiceOrderDetail",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDetail_ServiceOrderID",
                table: "ServiceOrderDetail",
                column: "ServiceOrderID");

            migrationBuilder.CreateIndex(
                name: "UQ__Staff__A9D10534F09B9C17",
                table: "Staff",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_VisitRegistration_ApprovedBy",
                table: "VisitRegistration",
                column: "ApprovedBy");

            migrationBuilder.CreateIndex(
                name: "IX_VisitRegistration_CustomerID",
                table: "VisitRegistration",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_VisitRegistration_NicheID",
                table: "VisitRegistration",
                column: "NicheID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NicheHistory");

            migrationBuilder.DropTable(
                name: "NicheReservation");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropTable(
                name: "ServiceOrderDetail");

            migrationBuilder.DropTable(
                name: "Contract");

            migrationBuilder.DropTable(
                name: "VisitRegistration");

            migrationBuilder.DropTable(
                name: "ServiceOrder");

            migrationBuilder.DropTable(
                name: "Service");

            migrationBuilder.DropTable(
                name: "Deceased");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "Niche");

            migrationBuilder.DropTable(
                name: "Area");

            migrationBuilder.DropTable(
                name: "Floor");

            migrationBuilder.DropTable(
                name: "Building");
        }
    }
}
