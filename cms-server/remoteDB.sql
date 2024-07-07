USE [master]
GO

-- Tạo database
CREATE DATABASE [cms]
GO

USE [cms]
GO

-- Tạo bảng Area
CREATE TABLE [dbo].[Area](
    [AreaID] INT IDENTITY(1,1) PRIMARY KEY,
    [FloorID] INT NOT NULL,
    [AreaName] NVARCHAR(255) NOT NULL,
    [AreaDescription] NVARCHAR(MAX) NULL,
    [AreaPicture] NVARCHAR(MAX) NULL
);
GO

-- Tạo bảng Building
CREATE TABLE [dbo].[Building](
    [BuildingID] INT IDENTITY(1,1) PRIMARY KEY,
    [BuildingName] NVARCHAR(255) NOT NULL,
    [BuildingDescription] NVARCHAR(MAX) NULL,
    [BuildingPicture] NVARCHAR(MAX) NULL
);
GO

-- Tạo bảng Contract
CREATE TABLE [dbo].[Contract](
    [ContractID] INT IDENTITY(1,1) PRIMARY KEY,
    [CustomerID] INT NOT NULL,
    [StaffID] INT NOT NULL,
    [NicheID] INT NOT NULL,
    [DeceasedID] INT NULL,
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NULL,
    [Status] NVARCHAR(50) NULL,
    [Note] NVARCHAR(MAX) NULL,
    [TotalAmount] DECIMAL(18, 0) NULL
);
GO

-- Tạo bảng Customer
CREATE TABLE [dbo].[Customer](
    [CustomerID] INT IDENTITY(1,1) PRIMARY KEY,
    [FullName] NVARCHAR(255) NOT NULL,
    [Email] NVARCHAR(255) NOT NULL,
    [Phone] NVARCHAR(50) NULL,
    [Address] NVARCHAR(255) NULL,
    [PasswordHash] NVARCHAR(255) NULL,
    [CitizenID] NVARCHAR(50) NULL,
    [CitizenIDIssuanceDate] DATE NULL,
    [CitizenIDSupplier] NVARCHAR(200) NULL
);
GO

-- Tạo bảng Deceased
CREATE TABLE [dbo].[Deceased](
    [DeceasedID] INT IDENTITY(1,1) PRIMARY KEY,
    [CitizenID] NVARCHAR(50) NULL,
    [FullName] NVARCHAR(255) NOT NULL,
    [DateOfBirth] DATE NULL,
    [DateOfDeath] DATE NULL,
    [NicheID] INT NULL,
    [CustomerID] INT NULL,
    [DeathCertificateNumber] NVARCHAR(200) NULL,
    [DeathCertificateSupplier] NVARCHAR(200) NULL,
    [RelationshipWithCusomer] NVARCHAR(50) NULL
);
GO

-- Tạo bảng Floor
CREATE TABLE [dbo].[Floor](
    [FloorID] INT IDENTITY(1,1) PRIMARY KEY,
    [BuildingID] INT NOT NULL,
    [FloorName] NVARCHAR(255) NOT NULL,
    [FloorDescription] NVARCHAR(MAX) NULL,
    [NichePrice] DECIMAL(18, 0) NULL,
    [FloorPicture] NVARCHAR(MAX) NULL
);
GO

-- Tạo bảng Niche
CREATE TABLE [dbo].[Niche](
    [NicheID] INT IDENTITY(1,1) PRIMARY KEY,
    [AreaID] INT NOT NULL,
    [NicheName] NVARCHAR(255) NOT NULL,
    [Status] NVARCHAR(50) NULL,
    [NicheDescription] NVARCHAR(MAX) NULL,
    [CustomerID] INT NULL,
    [DeceasedID] INT NULL
);
GO

-- Tạo bảng NicheHistory
CREATE TABLE [dbo].[NicheHistory](
    [NicheHistoryID] INT IDENTITY(1,1) PRIMARY KEY,
    [NicheID] INT NOT NULL,
    [CustomerID] INT NOT NULL,
    [DeceasedID] INT NULL,
    [ContractID] INT NULL,
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NULL,
    [Status] NVARCHAR(50) NULL
);
GO

-- Tạo bảng NicheReservation
CREATE TABLE [dbo].[NicheReservation](
    [ReservationID] INT IDENTITY(1,1) PRIMARY KEY,
    [NicheID] INT NOT NULL,
    [CreatedDate] DATETIME NULL,
    [ConfirmationDate] DATETIME NULL,
    [Status] NVARCHAR(50) NULL,
    [SignAddress] NVARCHAR(MAX) NULL,
    [PhoneNumber] NVARCHAR(50) NULL,
    [Note] NVARCHAR(MAX) NULL,
    [Name] NVARCHAR(MAX) NULL,
    [ConfirmedBy] INT NULL
);
GO

-- Tạo bảng Notification
CREATE TABLE [dbo].[Notification](
    [NotificationID] INT IDENTITY(1,1) PRIMARY KEY,
    [CustomerID] INT NULL,
    [StaffID] INT NULL,
    [ContractID] INT NULL,
    [ServiceOrderID] INT NULL,
    [VisitID] INT NULL,
    [NotificationDate] DATETIME NULL,
    [Message] NVARCHAR(MAX) NULL
);
GO

-- Tạo bảng Report
CREATE TABLE [dbo].[Report](
    [ReportID] INT IDENTITY(1,1) PRIMARY KEY,
    [ReportType] NVARCHAR(255) NULL,
    [GeneratedDate] DATETIME NULL,
    [Content] NVARCHAR(MAX) NULL
);
GO

-- Tạo bảng Service
CREATE TABLE [dbo].[Service](
    [ServiceID] INT IDENTITY(1,1) PRIMARY KEY,
    [ServiceName] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    [Price] DECIMAL(18, 0) NULL,
    [ServicePicture] NVARCHAR(MAX) NULL,
    [Category] NVARCHAR(MAX) NULL,
    [Tag] NVARCHAR(MAX) NULL
);
GO

-- Tạo bảng ServiceOrder
CREATE TABLE [dbo].[ServiceOrder](
    [ServiceOrderID] INT IDENTITY(1,1) PRIMARY KEY,
    [CustomerID] INT NOT NULL,
    [NicheID] INT NOT NULL,
    [OrderDate] DATETIME NULL,
    [StaffID] INT NULL,
    [ServiceOrderCode] NVARCHAR(15) NULL
);
GO

-- Tạo bảng ServiceOrderDetail
CREATE TABLE [dbo].[ServiceOrderDetail](
    [ServiceOrderDetailID] INT IDENTITY(1,1) PRIMARY KEY,
    [ServiceOrderID] INT NOT NULL,
    [ServiceID] INT NOT NULL,
    [Quantity] INT NOT NULL,
    [CompletionImage] NVARCHAR(MAX) NULL,
    [Status] NVARCHAR(50) NULL
);
GO

-- Tạo bảng Staff
CREATE TABLE [dbo].[Staff](
    [StaffID] INT IDENTITY(1,1) PRIMARY KEY,
    [FullName] NVARCHAR(255) NOT NULL,
    [PasswordHash] NVARCHAR(255) NOT NULL,
    [Email] NVARCHAR(255) NULL,
    [Phone] NVARCHAR(50) NULL,
    [Role] NVARCHAR(50) NULL
);
GO

-- Tạo bảng VisitRegistration
CREATE TABLE [dbo].[VisitRegistration](
    [VisitID] INT IDENTITY(1,1) PRIMARY KEY,
    [CustomerID] INT NOT NULL,
    [NicheID] INT NOT NULL,
    [VisitDate] DATETIME NULL,
    [Status] NVARCHAR(50) NULL,
    [ApprovedBy] INT NULL,
    [CreatedDate] DATETIME NULL,
    [Note] NVARCHAR(MAX) NULL,
    [AccompanyingPeople] INT NULL
);
GO

-- Thêm khóa ngoại (FK)
ALTER TABLE [dbo].[Area] ADD FOREIGN KEY([FloorID]) REFERENCES [dbo].[Floor] ([FloorID]);
GO
ALTER TABLE [dbo].[Contract] ADD FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customer] ([CustomerID]);
GO
ALTER TABLE [dbo].[Contract] ADD FOREIGN KEY([DeceasedID]) REFERENCES [dbo].[Deceased] ([DeceasedID]);
GO
ALTER TABLE [dbo].[Contract] ADD FOREIGN KEY([NicheID]) REFERENCES [dbo].[Niche] ([NicheID]);
GO
ALTER TABLE [dbo].[Contract] ADD FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID]);
GO
ALTER TABLE [dbo].[Deceased] ADD FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customer] ([CustomerID]);
GO
ALTER TABLE [dbo].[Deceased] ADD FOREIGN KEY([NicheID]) REFERENCES [dbo].[Niche] ([NicheID]);
GO
ALTER TABLE [dbo].[Floor] ADD FOREIGN KEY([BuildingID]) REFERENCES [dbo].[Building] ([BuildingID]);
GO
ALTER TABLE [dbo].[Niche] ADD FOREIGN KEY([AreaID]) REFERENCES [dbo].[Area] ([AreaID]);
GO
ALTER TABLE [dbo].[NicheHistory] ADD FOREIGN KEY([ContractID]) REFERENCES [dbo].[Contract] ([ContractID]);
GO
ALTER TABLE [dbo].[NicheHistory] ADD FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customer] ([CustomerID]);
GO
ALTER TABLE [dbo].[NicheHistory] ADD FOREIGN KEY([DeceasedID]) REFERENCES [dbo].[Deceased] ([DeceasedID]);
GO
ALTER TABLE [dbo].[NicheHistory] ADD FOREIGN KEY([NicheID]) REFERENCES [dbo].[Niche] ([NicheID]);
GO
ALTER TABLE [dbo].[NicheReservation] ADD FOREIGN KEY([NicheID]) REFERENCES [dbo].[Niche] ([NicheID]);
GO
ALTER TABLE [dbo].[Notification] ADD FOREIGN KEY([ContractID]) REFERENCES [dbo].[Contract] ([ContractID]);
GO
ALTER TABLE [dbo].[Notification] ADD FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customer] ([CustomerID]);
GO
ALTER TABLE [dbo].[Notification] ADD FOREIGN KEY([ServiceOrderID]) REFERENCES [dbo].[ServiceOrder] ([ServiceOrderID]);
GO
ALTER TABLE [dbo].[Notification] ADD FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID]);
GO
ALTER TABLE [dbo].[Notification] ADD FOREIGN KEY([VisitID]) REFERENCES [dbo].[VisitRegistration] ([VisitID]);
GO
ALTER TABLE [dbo].[ServiceOrder] ADD FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customer] ([CustomerID]);
GO
ALTER TABLE [dbo].[ServiceOrder] ADD FOREIGN KEY([NicheID]) REFERENCES [dbo].[Niche] ([NicheID]);
GO
ALTER TABLE [dbo].[ServiceOrder] ADD FOREIGN KEY([StaffID]) REFERENCES [dbo].[Staff] ([StaffID]);
GO
ALTER TABLE [dbo].[ServiceOrderDetail] ADD FOREIGN KEY([ServiceOrderID]) REFERENCES [dbo].[ServiceOrder] ([ServiceOrderID]);
GO
ALTER TABLE [dbo].[ServiceOrderDetail] ADD FOREIGN KEY([ServiceID]) REFERENCES [dbo].[Service] ([ServiceID]);
GO
ALTER TABLE [dbo].[VisitRegistration] ADD FOREIGN KEY([ApprovedBy]) REFERENCES [dbo].[Staff] ([StaffID]);
GO
ALTER TABLE [dbo].[VisitRegistration] ADD FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customer] ([CustomerID]);
GO
ALTER TABLE [dbo].[VisitRegistration] ADD FOREIGN KEY([NicheID]) REFERENCES [dbo].[Niche] ([NicheID]);
GO

USE [master]
GO
ALTER DATABASE [cms] SET READ_WRITE 
GO
