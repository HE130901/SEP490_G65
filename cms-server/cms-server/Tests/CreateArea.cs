using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateAreaTests
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
        public void CreateArea_ValidData_ShouldCreateArea()
        {
            // Arrange
            var floor = new Floor
            {
                FloorName = "Test Floor",
                BuildingId = 1,
                FloorDescription = "A test floor",
                FloorPicture = "test.jpg",
                FloorCode = "F001"
            };
            _context.Floors.Add(floor);
            _context.SaveChanges();

            var area = new Area
            {
                FloorId = floor.FloorId,
                AreaName = "Test Area",
                AreaDescription = "A test area",
                AreaPicture = "test.jpg",
                AreaCode = "A001"
            };

            // Act
            _context.Areas.Add(area);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Areas.Count());
            Assert.AreEqual("Test Area", _context.Areas.First().AreaName);
        }

        [Test]
        public void CreateArea_InvalidData_ShouldFail()
        {
            // Arrange
            var area = new Area
            {
                FloorId = 0, // Invalid FloorId
                AreaName = "", // Invalid name
                AreaDescription = "A test area",
                AreaPicture = "test.jpg",
                AreaCode = "A001"
            };

            // Act
            _context.Areas.Add(area);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Areas.Count());
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}