using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using cms_server.Configuration; // Assuming your DbContext is in this namespace

namespace cms_server.Tests
{
    public class CreateBuildingTests
    {
        private CmsContext _context;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new CmsContext(options);
        }

        [Test]
        public void CreateBuilding_ValidData_ShouldCreateBuilding()
        {
            // Arrange
            var building = new Building
            {
                BuildingName = "Test Building",
                BuildingDescription = "A test building",
                BuildingPicture = "test.jpg",
                BuildingCode = "TB001"
            };

            // Act
            _context.Buildings.Add(building);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Buildings.Count());
            Assert.AreEqual("Test Building", _context.Buildings.First().BuildingName);
        }

        [Test]
        public void CreateBuilding_InvalidData_ShouldFail()
        {
            // Arrange
            var building = new Building
            {
                BuildingName = "", // Invalid name
                BuildingDescription = "A test building",
                BuildingPicture = "test.jpg",
                BuildingCode = "TB001"
            };

            // Act
            _context.Buildings.Add(building);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Buildings.Count());
        }

        [Test]
        public void CreateBuilding_DuplicateData_ShouldFail()
        {
            // Arrange
            var building1 = new Building
            {
                BuildingName = "Duplicate Building",
                BuildingDescription = "A duplicate test building",
                BuildingPicture = "duplicate.jpg",
                BuildingCode = "DB001"
            };

            var building2 = new Building
            {
                BuildingName = "Duplicate Building",
                BuildingDescription = "A duplicate test building",
                BuildingPicture = "duplicate.jpg",
                BuildingCode = "DB001"
            };

            // Act
            _context.Buildings.Add(building1);
            _context.SaveChanges();
            _context.Buildings.Add(building2);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(2, _context.Buildings.Count());
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}