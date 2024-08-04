using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateContractRenewTests
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
        public void CreateContractRenew_ValidData_ShouldCreateContractRenew()
        {
            // Arrange
            var customer = new Customer { FullName = "Abcd", Email = "abcd@cms.com" };
            var staff = new Staff { FullName = "Abcde", Email = "abcde@cms.com", PasswordHash = "abcd" };
            var niche = new Niche { NicheName = "Niche A" };

            _context.Customers.Add(customer);
            _context.Staff.Add(staff);
            _context.Niches.Add(niche);
            _context.SaveChanges();

            var contract = new Contract
            {
                CustomerId = customer.CustomerId,
                StaffId = staff.StaffId,
                NicheId = niche.NicheId,
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                Status = "Active",
                TotalAmount = 1000.00m,
                ContractCode = "C001"
            };

            _context.Contracts.Add(contract);
            _context.SaveChanges();

            var contractRenew = new ContractRenew
            {
                ContractId = contract.ContractId,
                ContractRenewCode = "CR001",
                Status = "Active",
                CreatedDate = DateOnly.FromDateTime(DateTime.Now),
                EndDate = DateOnly.FromDateTime(DateTime.Now.AddYears(1)),
                TotalAmount = 500.00m,
                Note = "First renewal"
            };

            // Act
            _context.ContractRenews.Add(contractRenew);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.ContractRenews.Count());
            Assert.AreEqual("CR001", _context.ContractRenews.First().ContractRenewCode);
        }

        [Test]
        public void CreateContractRenew_InvalidData_ShouldFail()
        {
            // Arrange
            var contractRenew = new ContractRenew
            {
                ContractId = 0, // Invalid ContractId
                ContractRenewCode = "CR001",
                Status = "Active",
                CreatedDate = DateOnly.FromDateTime(DateTime.Now),
                EndDate = DateOnly.FromDateTime(DateTime.Now.AddYears(1)),
                TotalAmount = 500.00m,
                Note = "First renewal"
            };

            // Act
            _context.ContractRenews.Add(contractRenew);
            try
            {
                ValidateContractRenew(contractRenew);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.ContractRenews.Count());
            }
        }

        private void ValidateContractRenew(ContractRenew contractRenew)
        {
            if (!_context.Contracts.Any(c => c.ContractId == contractRenew.ContractId))
                throw new ValidationException("Invalid ContractId");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

  
}