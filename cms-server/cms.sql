-- Use the cms database
USE cms;
GO

-- Bảng Building
CREATE TABLE Building (
    BuildingID INT PRIMARY KEY IDENTITY(1,1),
    BuildingName NVARCHAR(255) NOT NULL,
    BuildingDescription NVARCHAR(MAX),
    BuildingPicture NVARCHAR(MAX)
);

-- Bảng Staff
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) UNIQUE,
    Phone NVARCHAR(50),
    Role NVARCHAR(50)
);

-- Bảng Customer
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Phone NVARCHAR(50),
    Address NVARCHAR(255),
    PasswordHash NVARCHAR(255) NOT NULL,
    CitizenID NVARCHAR(50) UNIQUE
);

-- Bảng Floor
CREATE TABLE Floor (
    FloorID INT PRIMARY KEY IDENTITY(1,1),
    BuildingID INT NOT NULL,
    FloorName NVARCHAR(255) NOT NULL,
    FloorDescription NVARCHAR(MAX),
    NichePrice DECIMAL(18, 0), -- Giá tiền Việt Nam
    FloorPicture NVARCHAR(MAX),
    FOREIGN KEY (BuildingID) REFERENCES Building(BuildingID)
);

-- Bảng Area
CREATE TABLE Area (
    AreaID INT PRIMARY KEY IDENTITY(1,1),
    FloorID INT NOT NULL,
    AreaName NVARCHAR(255) NOT NULL,
    AreaDescription NVARCHAR(MAX),
    AreaPicture NVARCHAR(MAX),
    FOREIGN KEY (FloorID) REFERENCES Floor(FloorID)
);

-- Bảng Niche
CREATE TABLE Niche (
    NicheID INT PRIMARY KEY IDENTITY(1,1),
    AreaID INT NOT NULL,
    NicheName NVARCHAR(255) NOT NULL,
    Status NVARCHAR(50),
    NicheDescription NVARCHAR(MAX),
    CustomerID INT,
    DeceasedID INT,
    FOREIGN KEY (AreaID) REFERENCES Area(AreaID)
);

-- Bảng Deceased
CREATE TABLE Deceased (
    DeceasedID INT PRIMARY KEY IDENTITY(1,1),
    CitizenID NVARCHAR(50) UNIQUE,
    FullName NVARCHAR(255) NOT NULL,
    DateOfBirth DATE,
    DateOfDeath DATE,
    NicheID INT,
    CustomerID INT,
    FOREIGN KEY (NicheID) REFERENCES Niche(NicheID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

-- Bảng Service
CREATE TABLE Service (
    ServiceID INT PRIMARY KEY IDENTITY(1,1),
    ServiceName NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18, 0) -- Giá dịch vụ (Giá tiền Việt Nam)
);

-- Bảng Contract
CREATE TABLE Contract (
    ContractID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    StaffID INT NOT NULL,
    NicheID INT NOT NULL,
    DeceasedID INT,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Status NVARCHAR(50),
    ServicePriceList NVARCHAR(MAX),
    TotalAmount DECIMAL(18, 0), -- Tổng số tiền (Giá tiền Việt Nam)
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (NicheID) REFERENCES Niche(NicheID),
    FOREIGN KEY (DeceasedID) REFERENCES Deceased(DeceasedID)
);

-- Bảng ServiceOrder
CREATE TABLE ServiceOrder (
    ServiceOrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    NicheID INT NOT NULL,
    ServiceList NVARCHAR(MAX),
    OrderDate DATE,
    Status NVARCHAR(50),
    CompletionImage NVARCHAR(MAX),
    StaffID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (NicheID) REFERENCES Niche(NicheID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
);

-- Bảng VisitRegistration
CREATE TABLE VisitRegistration (
    VisitID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    NicheID INT NOT NULL,
    VisitDate DATE NOT NULL,
    Status NVARCHAR(50),
    ApprovedBy INT,
    ApprovalDate DATE,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (NicheID) REFERENCES Niche(NicheID),
    FOREIGN KEY (ApprovedBy) REFERENCES Staff(StaffID)
);

-- Bảng Report
CREATE TABLE Report (
    ReportID INT PRIMARY KEY IDENTITY(1,1),
    ReportType NVARCHAR(255),
    GeneratedDate DATE,
    Content NVARCHAR(MAX)
);

-- Bảng NicheReservation
CREATE TABLE NicheReservation (
    ReservationID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    NicheID INT NOT NULL,
    CreatedDate DATE NOT NULL,
    ConfirmationDate DATE,
    Status NVARCHAR(50),
    ConfirmedBy INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (NicheID) REFERENCES Niche(NicheID),
    FOREIGN KEY (ConfirmedBy) REFERENCES Staff(StaffID)
);

-- Bảng Notification
CREATE TABLE Notification (
    NotificationID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT,
    StaffID INT,
    ContractID INT,
    ServiceOrderID INT,
    VisitID INT,
    NotificationDate DATE,
    Message NVARCHAR(MAX),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (ContractID) REFERENCES Contract(ContractID),
    FOREIGN KEY (ServiceOrderID) REFERENCES ServiceOrder(ServiceOrderID),
    FOREIGN KEY (VisitID) REFERENCES VisitRegistration(VisitID)
);

-- Bảng NicheHistory
CREATE TABLE NicheHistory (
    NicheHistoryID INT PRIMARY KEY IDENTITY(1,1),
    NicheID INT NOT NULL,
    CustomerID INT NOT NULL,
    DeceasedID INT,
    ContractID INT,
    StartDate DATE NOT NULL,
    EndDate DATE,
    FOREIGN KEY (NicheID) REFERENCES Niche(NicheID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (DeceasedID) REFERENCES Deceased(DeceasedID),
    FOREIGN KEY (ContractID) REFERENCES Contract(ContractID)
);

-- Sửa đổi bảng Customer để thêm cột AccountStatus
ALTER TABLE Customer
ADD AccountStatus NVARCHAR(50) DEFAULT 'Guest';


ALTER TABLE NicheReservation
ADD SignAddress NVARCHAR(MAX),
    PhoneNumber NVARCHAR(50),
    Note NVARCHAR(MAX);

-- Bảng ServiceOrder: Update OrderDate to include time
ALTER TABLE ServiceOrder
ALTER COLUMN OrderDate DATETIME;

-- Bảng VisitRegistration: Update VisitDate and ApprovalDate to include time
ALTER TABLE VisitRegistration
ALTER COLUMN VisitDate DATETIME;

ALTER TABLE VisitRegistration
ALTER COLUMN ApprovalDate DATETIME;

-- Bảng Report: Update GeneratedDate to include time
ALTER TABLE Report
ALTER COLUMN GeneratedDate DATETIME;

-- Bảng NicheReservation: Update CreatedDate and ConfirmationDate to include time
ALTER TABLE NicheReservation
ALTER COLUMN CreatedDate DATETIME;

ALTER TABLE NicheReservation
ALTER COLUMN ConfirmationDate DATETIME;

-- Bảng Notification: Update NotificationDate to include time
ALTER TABLE Notification
ALTER COLUMN NotificationDate DATETIME;

ALTER TABLE NicheReservation
ADD Note NVARCHAR(MAX);

ALTER TABLE Customer
ADD PasswordResetToken NVARCHAR(MAX);

ALTER TABLE Customer
ADD PasswordResetTokenExpiration DATETIME;



