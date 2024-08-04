using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateFloorTests
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
        public void CreateFloor_ValidData_ShouldCreateFloor()
        {
            // Arrange
            var building = new Building { BuildingName = "Building A" };

            _context.Buildings.Add(building);
            _context.SaveChanges();

            var floor = new Floor
            {
                BuildingId = building.BuildingId,
                FloorName = "First Floor",
                FloorDescription = "Description of the first floor",
                FloorPicture = "picture_url",
                FloorCode = "F001"
            };

            // Act
            _context.Floors.Add(floor);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Floors.Count());
            Assert.AreEqual("First Floor", _context.Floors.First().FloorName);
        }

        [Test]
        public void CreateFloor_InvalidData_ShouldFail()
        {
            // Arrange
            var floor = new Floor
            {
                BuildingId = 0, // Invalid BuildingId
                FloorName = "", // Invalid FloorName
                FloorDescription = "Description of the first floor",
                FloorPicture = "picture_url",
                FloorCode = "F001"
            };

            // Act
            _context.Floors.Add(floor);
            try
            {
                ValidateFloor(floor);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Floors.Count());
            }
        }

        private void ValidateFloor(Floor floor)
        {
            if (string.IsNullOrWhiteSpace(floor.FloorName))
                throw new ValidationException("FloorName is required.");

            if (!_context.Buildings.Any(b => b.BuildingId == floor.BuildingId))
                throw new ValidationException("Invalid BuildingId.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

  
}