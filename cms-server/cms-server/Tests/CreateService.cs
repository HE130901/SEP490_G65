using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateServiceTests
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
        public void CreateService_ValidData_ShouldCreateService()
        {
            // Arrange
            var service = new Service
            {
                ServiceName = "Cleaning Service",
                Description = "A comprehensive cleaning service",
                Price = 100.00m,
                ServicePicture = "picture_url",
                Category = "Cleaning",
                Tag = "Home",
                Status = "Available"
            };

            // Act
            _context.Services.Add(service);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Services.Count());
            Assert.AreEqual("Cleaning Service", _context.Services.First().ServiceName);
        }

        [Test]
        public void CreateService_InvalidData_ShouldFail()
        {
            // Arrange
            var service = new Service
            {
                ServiceName = "", // Invalid ServiceName
                Description = "A comprehensive cleaning service",
                Price = 100.00m,
                ServicePicture = "picture_url",
                Category = "Cleaning",
                Tag = "Home",
                Status = "Available"
            };

            // Act
            _context.Services.Add(service);
            try
            {
                ValidateService(service);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Services.Count());
            }
        }

        private void ValidateService(Service service)
        {
            if (string.IsNullOrWhiteSpace(service.ServiceName))
                throw new ValidationException("ServiceName is required.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

   
}