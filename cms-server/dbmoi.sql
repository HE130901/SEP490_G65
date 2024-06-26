USE [master]
GO
/****** Object:  Database [cms]    Script Date: 28/06/2024 21:57:13 ******/
CREATE DATABASE [cms]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'cms', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\cms.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'cms_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\cms_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [cms] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [cms].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [cms] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [cms] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [cms] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [cms] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [cms] SET ARITHABORT OFF 
GO
ALTER DATABASE [cms] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [cms] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [cms] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [cms] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [cms] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [cms] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [cms] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [cms] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [cms] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [cms] SET  ENABLE_BROKER 
GO
ALTER DATABASE [cms] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [cms] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [cms] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [cms] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [cms] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [cms] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [cms] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [cms] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [cms] SET  MULTI_USER 
GO
ALTER DATABASE [cms] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [cms] SET DB_CHAINING OFF 
GO
ALTER DATABASE [cms] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [cms] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [cms] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [cms] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [cms] SET QUERY_STORE = ON
GO
ALTER DATABASE [cms] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [cms]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 28/06/2024 21:57:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Area]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Area](
	[AreaID] [int] IDENTITY(1,1) NOT NULL,
	[FloorID] [int] NOT NULL,
	[AreaName] [nvarchar](255) NOT NULL,
	[AreaDescription] [nvarchar](max) NULL,
	[AreaPicture] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[AreaID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Building]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Building](
	[BuildingID] [int] IDENTITY(1,1) NOT NULL,
	[BuildingName] [nvarchar](255) NOT NULL,
	[BuildingDescription] [nvarchar](max) NULL,
	[BuildingPicture] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[BuildingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Contract]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Contract](
	[ContractID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NOT NULL,
	[StaffID] [int] NOT NULL,
	[NicheID] [int] NOT NULL,
	[DeceasedID] [int] NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NULL,
	[Status] [nvarchar](50) NULL,
	[Note] [nvarchar](max) NULL,
	[TotalAmount] [decimal](18, 0) NULL,
PRIMARY KEY CLUSTERED 
(
	[ContractID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customer]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[CustomerID] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Phone] [nvarchar](50) NULL,
	[Address] [nvarchar](255) NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[CitizenID] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[CustomerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[CitizenID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Deceased]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Deceased](
	[DeceasedID] [int] IDENTITY(1,1) NOT NULL,
	[CitizenID] [nvarchar](50) NULL,
	[FullName] [nvarchar](255) NOT NULL,
	[DateOfBirth] [date] NULL,
	[DateOfDeath] [date] NULL,
	[NicheID] [int] NULL,
	[CustomerID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[DeceasedID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[CitizenID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Floor]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Floor](
	[FloorID] [int] IDENTITY(1,1) NOT NULL,
	[BuildingID] [int] NOT NULL,
	[FloorName] [nvarchar](255) NOT NULL,
	[FloorDescription] [nvarchar](max) NULL,
	[NichePrice] [decimal](18, 0) NULL,
	[FloorPicture] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[FloorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Niche]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Niche](
	[NicheID] [int] IDENTITY(1,1) NOT NULL,
	[AreaID] [int] NOT NULL,
	[NicheName] [nvarchar](255) NOT NULL,
	[Status] [nvarchar](50) NULL,
	[NicheDescription] [nvarchar](max) NULL,
	[CustomerID] [int] NULL,
	[DeceasedID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[NicheID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NicheHistory]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NicheHistory](
	[NicheHistoryID] [int] IDENTITY(1,1) NOT NULL,
	[NicheID] [int] NOT NULL,
	[CustomerID] [int] NOT NULL,
	[DeceasedID] [int] NULL,
	[ContractID] [int] NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[NicheHistoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NicheReservation]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NicheReservation](
	[ReservationID] [int] IDENTITY(1,1) NOT NULL,
	[NicheID] [int] NOT NULL,
	[CreatedDate] [datetime] NULL,
	[ConfirmationDate] [datetime] NULL,
	[Status] [nvarchar](50) NULL,
	[SignAddress] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](50) NULL,
	[Note] [nvarchar](max) NULL,
	[Name] [nvarchar](max) NULL,
	[ConfirmedBy] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ReservationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notification]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[NotificationID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NULL,
	[StaffID] [int] NULL,
	[ContractID] [int] NULL,
	[ServiceOrderID] [int] NULL,
	[VisitID] [int] NULL,
	[NotificationDate] [datetime] NULL,
	[Message] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[NotificationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Report]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Report](
	[ReportID] [int] IDENTITY(1,1) NOT NULL,
	[ReportType] [nvarchar](255) NULL,
	[GeneratedDate] [datetime] NULL,
	[Content] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ReportID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Service]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Service](
	[ServiceID] [int] IDENTITY(1,1) NOT NULL,
	[ServiceName] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Price] [decimal](18, 0) NULL,
	[ServicePicture] [nvarchar](max) NULL,
	[Category] [nvarchar](max) NULL,
	[Tag] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ServiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ServiceOrder]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ServiceOrder](
	[ServiceOrderID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NOT NULL,
	[NicheID] [int] NOT NULL,
	[OrderDate] [datetime] NULL,
	[Status] [nvarchar](50) NULL,
	[StaffID] [int] NULL,
	[CompletionImage] [nvarchar](max) NULL,
	[ServiceOrderCode] [nvarchar](15) NULL,
PRIMARY KEY CLUSTERED 
(
	[ServiceOrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_ServiceOrderCode] UNIQUE NONCLUSTERED 
(
	[ServiceOrderCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ServiceOrderDetail]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ServiceOrderDetail](
	[ServiceOrderDetailID] [int] IDENTITY(1,1) NOT NULL,
	[ServiceOrderID] [int] NOT NULL,
	[ServiceID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[CompletionImage] [nvarchar](max) NULL,
	[Status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[ServiceOrderDetailID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Staff]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Staff](
	[StaffID] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](255) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](255) NULL,
	[Phone] [nvarchar](50) NULL,
	[Role] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[StaffID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VisitRegistration]    Script Date: 28/06/2024 21:57:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VisitRegistration](
	[VisitID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NOT NULL,
	[NicheID] [int] NOT NULL,
	[VisitDate] [datetime] NULL,
	[Status] [nvarchar](50) NULL,
	[ApprovedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[Note] [nvarchar](max) NULL,
	[AccompanyingPeople] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[VisitID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[ServiceOrder] ADD  DEFAULT (left(CONVERT([nvarchar](36),newid()),(15))) FOR [ServiceOrderCode]
GO
ALTER TABLE [dbo].[ServiceOrderDetail] ADD  DEFAULT ((1)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Area]  WITH CHECK ADD FOREIGN KEY([FloorID])
REFERENCES [dbo].[Floor] ([FloorID])
GO
ALTER TABLE [dbo].[Contract]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[Contract]  WITH CHECK ADD FOREIGN KEY([DeceasedID])
REFERENCES [dbo].[Deceased] ([DeceasedID])
GO
ALTER TABLE [dbo].[Contract]  WITH CHECK ADD FOREIGN KEY([NicheID])
REFERENCES [dbo].[Niche] ([NicheID])
GO
ALTER TABLE [dbo].[Contract]  WITH CHECK ADD FOREIGN KEY([StaffID])
REFERENCES [dbo].[Staff] ([StaffID])
GO
ALTER TABLE [dbo].[Deceased]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[Deceased]  WITH CHECK ADD FOREIGN KEY([NicheID])
REFERENCES [dbo].[Niche] ([NicheID])
GO
ALTER TABLE [dbo].[Floor]  WITH CHECK ADD FOREIGN KEY([BuildingID])
REFERENCES [dbo].[Building] ([BuildingID])
GO
ALTER TABLE [dbo].[Niche]  WITH CHECK ADD FOREIGN KEY([AreaID])
REFERENCES [dbo].[Area] ([AreaID])
GO
ALTER TABLE [dbo].[NicheHistory]  WITH CHECK ADD FOREIGN KEY([ContractID])
REFERENCES [dbo].[Contract] ([ContractID])
GO
ALTER TABLE [dbo].[NicheHistory]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[NicheHistory]  WITH CHECK ADD FOREIGN KEY([DeceasedID])
REFERENCES [dbo].[Deceased] ([DeceasedID])
GO
ALTER TABLE [dbo].[NicheHistory]  WITH CHECK ADD FOREIGN KEY([NicheID])
REFERENCES [dbo].[Niche] ([NicheID])
GO
ALTER TABLE [dbo].[NicheReservation]  WITH CHECK ADD FOREIGN KEY([NicheID])
REFERENCES [dbo].[Niche] ([NicheID])
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD FOREIGN KEY([ContractID])
REFERENCES [dbo].[Contract] ([ContractID])
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD FOREIGN KEY([ServiceOrderID])
REFERENCES [dbo].[ServiceOrder] ([ServiceOrderID])
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD FOREIGN KEY([StaffID])
REFERENCES [dbo].[Staff] ([StaffID])
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD FOREIGN KEY([VisitID])
REFERENCES [dbo].[VisitRegistration] ([VisitID])
GO
ALTER TABLE [dbo].[ServiceOrder]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[ServiceOrder]  WITH CHECK ADD FOREIGN KEY([NicheID])
REFERENCES [dbo].[Niche] ([NicheID])
GO
ALTER TABLE [dbo].[ServiceOrder]  WITH CHECK ADD FOREIGN KEY([StaffID])
REFERENCES [dbo].[Staff] ([StaffID])
GO
ALTER TABLE [dbo].[ServiceOrderDetail]  WITH CHECK ADD FOREIGN KEY([ServiceOrderID])
REFERENCES [dbo].[ServiceOrder] ([ServiceOrderID])
GO
ALTER TABLE [dbo].[ServiceOrderDetail]  WITH CHECK ADD FOREIGN KEY([ServiceID])
REFERENCES [dbo].[Service] ([ServiceID])
GO
ALTER TABLE [dbo].[VisitRegistration]  WITH CHECK ADD FOREIGN KEY([ApprovedBy])
REFERENCES [dbo].[Staff] ([StaffID])
GO
ALTER TABLE [dbo].[VisitRegistration]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[VisitRegistration]  WITH CHECK ADD FOREIGN KEY([NicheID])
REFERENCES [dbo].[Niche] ([NicheID])
GO
USE [master]
GO
ALTER DATABASE [cms] SET  READ_WRITE 
GO
