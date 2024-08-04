using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateDeceasedTests
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
        public void CreateDeceased_ValidData_ShouldCreateDeceased()
        {
            // Arrange
            var customer = new Customer { FullName = "John Doe", Email = "john.doe@example.com" };
            var niche = new Niche { NicheName = "Niche A" };

            _context.Customers.Add(customer);
            _context.Niches.Add(niche);
            _context.SaveChanges();

            var deceased = new Deceased
            {
                FullName = "Jane Doe",
                CitizenId = "123456789",
                DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-80)),
                DateOfDeath = DateOnly.FromDateTime(DateTime.Now.AddYears(-1)),
                NicheId = niche.NicheId,
                CustomerId = customer.CustomerId,
                DeathCertificateNumber = "DC123456",
                DeathCertificateSupplier = "Government",
                RelationshipWithCusomer = "Spouse"
            };

            // Act
            _context.Deceaseds.Add(deceased);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Deceaseds.Count());
            Assert.AreEqual("Jane Doe", _context.Deceaseds.First().FullName);
        }

        [Test]
        public void CreateDeceased_InvalidData_ShouldFail()
        {
            // Arrange
            var deceased = new Deceased
            {
                FullName = "", // Invalid FullName
                CitizenId = "123456789",
                DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-80)),
                DateOfDeath = DateOnly.FromDateTime(DateTime.Now.AddYears(-1)),
                NicheId = 0, // Invalid NicheId
                CustomerId = 0, // Invalid CustomerId
                DeathCertificateNumber = "DC123456",
                DeathCertificateSupplier = "Government",
                RelationshipWithCusomer = "Spouse"
            };

            // Act
            _context.Deceaseds.Add(deceased);
            try
            {
                ValidateDeceased(deceased);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Deceaseds.Count());
            }
        }

        private void ValidateDeceased(Deceased deceased)
        {
            if (string.IsNullOrWhiteSpace(deceased.FullName))
                throw new ValidationException("FullName is required.");

            if (!_context.Niches.Any(n => n.NicheId == deceased.NicheId))
                throw new ValidationException("Invalid NicheId.");

            if (!_context.Customers.Any(c => c.CustomerId == deceased.CustomerId))
                throw new ValidationException("Invalid CustomerId.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}