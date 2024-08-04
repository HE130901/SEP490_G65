using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateNicheHistoryTests
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
        public void CreateNicheHistory_ValidData_ShouldCreateNicheHistory()
        {
            // Arrange
            var customer = new Customer { FullName = "John Doe", Email = "john.doe@example.com" };
            var niche = new Niche { NicheName = "Niche 1", AreaId = 1 };
            var contract = new Contract { ContractId = 1 };

            _context.Customers.Add(customer);
            _context.Niches.Add(niche);
            _context.Contracts.Add(contract);
            _context.SaveChanges();

            var nicheHistory = new NicheHistory
            {
                NicheId = niche.NicheId,
                CustomerId = customer.CustomerId,
                DeceasedId = null,
                ContractId = contract.ContractId,
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                EndDate = null,
                Status = "Active"
            };

            // Act
            _context.NicheHistories.Add(nicheHistory);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.NicheHistories.Count());
            Assert.AreEqual("Active", _context.NicheHistories.First().Status);
        }

        [Test]
        public void CreateNicheHistory_InvalidData_ShouldFail()
        {
            // Arrange
            var nicheHistory = new NicheHistory
            {
                NicheId = 0, // Invalid NicheId
                CustomerId = 0, // Invalid CustomerId
                DeceasedId = null,
                ContractId = null,
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                EndDate = null,
                Status = "Active"
            };

            // Act
            _context.NicheHistories.Add(nicheHistory);
            try
            {
                ValidateNicheHistory(nicheHistory);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.NicheHistories.Count());
            }
        }

        private void ValidateNicheHistory(NicheHistory nicheHistory)
        {
            if (!_context.Niches.Any(n => n.NicheId == nicheHistory.NicheId))
                throw new ValidationException("Invalid NicheId.");

            if (!_context.Customers.Any(c => c.CustomerId == nicheHistory.CustomerId))
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