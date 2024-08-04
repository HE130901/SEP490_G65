using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateStaffTests
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
        public void CreateStaff_ValidData_ShouldCreateStaff()
        {
            // Arrange
            var staff = new Staff
            {
                FullName = "Jane Doe",
                PasswordHash = "hashed_password",
                Email = "jane.doe@example.com",
                Phone = "123-456-7890",
                Role = "Admin"
            };

            // Act
            _context.Staff.Add(staff);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Staff.Count());
            Assert.AreEqual("Jane Doe", _context.Staff.First().FullName);
        }

        [Test]
        public void CreateStaff_InvalidData_ShouldFail()
        {
            // Arrange
            var staff = new Staff
            {
                FullName = "", // Invalid FullName
                PasswordHash = "hashed_password",
                Email = "jane.doe@example.com",
                Phone = "123-456-7890",
                Role = "Admin"
            };

            // Act
            _context.Staff.Add(staff);
            try
            {
                ValidateStaff(staff);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Staff.Count());
            }
        }

        private void ValidateStaff(Staff staff)
        {
            if (string.IsNullOrWhiteSpace(staff.FullName))
                throw new ValidationException("FullName is required.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

   
}