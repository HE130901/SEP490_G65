using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateVisitRegistrationTests
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
        public void CreateVisitRegistration_ValidData_ShouldCreateVisitRegistration()
        {
            // Arrange
            var customer = new Customer { FullName = "John Doe", Email = "john.doe@example.com" };
            var niche = new Niche { NicheName = "Niche 1", AreaId = 1 };

            _context.Customers.Add(customer);
            _context.Niches.Add(niche);
            _context.SaveChanges();

            var visitRegistration = new VisitRegistration
            {
                CustomerId = customer.CustomerId,
                NicheId = niche.NicheId,
                VisitDate = DateTime.Now,
                Status = "Pending",
                ApprovedBy = null,
                CreatedDate = DateTime.Now,
                Note = "First visit",
                AccompanyingPeople = 2,
                VisitCode = "VR001"
            };

            // Act
            _context.VisitRegistrations.Add(visitRegistration);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.VisitRegistrations.Count());
            Assert.AreEqual("VR001", _context.VisitRegistrations.First().VisitCode);
        }

        [Test]
        public void CreateVisitRegistration_InvalidData_ShouldFail()
        {
            // Arrange
            var visitRegistration = new VisitRegistration
            {
                CustomerId = 0, // Invalid CustomerId
                NicheId = 0, // Invalid NicheId
                VisitDate = DateTime.Now,
                Status = "Pending",
                ApprovedBy = null,
                CreatedDate = DateTime.Now,
                Note = "First visit",
                AccompanyingPeople = 2,
                VisitCode = "VR001"
            };

            // Act
            _context.VisitRegistrations.Add(visitRegistration);
            try
            {
                ValidateVisitRegistration(visitRegistration);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.VisitRegistrations.Count());
            }
        }

        private void ValidateVisitRegistration(VisitRegistration visitRegistration)
        {
            if (!_context.Customers.Any(c => c.CustomerId == visitRegistration.CustomerId))
                throw new ValidationException("Invalid CustomerId.");

            if (!_context.Niches.Any(n => n.NicheId == visitRegistration.NicheId))
                throw new ValidationException("Invalid NicheId.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }   
}