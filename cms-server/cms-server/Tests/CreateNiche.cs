using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateNicheTests
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
        public void CreateNiche_ValidData_ShouldCreateNiche()
        {
            // Arrange
            var area = new Area { AreaName = "Area A" };

            _context.Areas.Add(area);
            _context.SaveChanges();

            var niche = new Niche
            {
                AreaId = area.AreaId,
                NicheName = "Niche 1",
                Status = "Available",
                NicheDescription = "Description of Niche 1",
                NicheCode = "N001"
            };

            // Act
            _context.Niches.Add(niche);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Niches.Count());
            Assert.AreEqual("Niche 1", _context.Niches.First().NicheName);
        }

        [Test]
        public void CreateNiche_InvalidData_ShouldFail()
        {
            // Arrange
            var niche = new Niche
            {
                AreaId = 0, // Invalid AreaId
                NicheName = "", // Invalid NicheName
                Status = "Available",
                NicheDescription = "Description of Niche 1",
                NicheCode = "N001"
            };

            // Act
            _context.Niches.Add(niche);
            try
            {
                ValidateNiche(niche);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Niches.Count());
            }
        }

        private void ValidateNiche(Niche niche)
        {
            if (string.IsNullOrWhiteSpace(niche.NicheName))
                throw new ValidationException("NicheName is required.");

            if (!_context.Areas.Any(a => a.AreaId == niche.AreaId))
                throw new ValidationException("Invalid AreaId.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

   
}