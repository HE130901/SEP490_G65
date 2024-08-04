using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateContractTests
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
        public void CreateContract_ValidData_ShouldCreateContract()
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

            // Act
            _context.Contracts.Add(contract);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Contracts.Count());
            Assert.AreEqual("C001", _context.Contracts.First().ContractCode);
        }

        [Test]
        public void CreateContract_InvalidData_ShouldFail()
        {
            // Arrange
            var contract = new Contract
            {
                CustomerId = 0, // Invalid CustomerId
                StaffId = 0, // Invalid StaffId
                NicheId = 0, // Invalid NicheId
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                Status = "Active",
                TotalAmount = 1000.00m,
                ContractCode = "C001"
            };

            // Act
            _context.Contracts.Add(contract);
            try
            {
                ValidateContract(contract);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Contracts.Count());
            }
        }

        private void ValidateContract(Contract contract)
        {
            if (!_context.Customers.Any(c => c.CustomerId == contract.CustomerId))
                throw new ValidationException("Invalid CustomerId");

            if (!_context.Staff.Any(s => s.StaffId == contract.StaffId))
                throw new ValidationException("Invalid StaffId");

            if (!_context.Niches.Any(n => n.NicheId == contract.NicheId))
                throw new ValidationException("Invalid NicheId");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

    public class ValidationException : Exception
    {
        public ValidationException(string message) : base(message) { }
    }
}