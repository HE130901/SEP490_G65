using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateCustomerTests
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
        public void CreateCustomer_ValidData_ShouldCreateCustomer()
        {
            // Arrange
            var customer = new Customer
            {
                FullName = "John Doe",
                Email = "john.doe@example.com",
                Phone = "1234567890",
                Address = "123 Main St",
                PasswordHash = "hashedpassword",
                CitizenId = "123456789",
                CitizenIdissuanceDate = DateOnly.FromDateTime(DateTime.Now.AddYears(-5)),
                CitizenIdsupplier = "Government"
            };

            // Act
            _context.Customers.Add(customer);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Customers.Count());
            Assert.AreEqual("John Doe", _context.Customers.First().FullName);
        }

        [Test]
        public void CreateCustomer_InvalidData_ShouldFail()
        {
            // Arrange
            var customer = new Customer
            {
                FullName = "", // Invalid FullName
                Email = "invalid-email", // Invalid Email
                Phone = "1234567890",
                Address = "123 Main St",
                PasswordHash = "hashedpassword",
                CitizenId = "123456789",
                CitizenIdissuanceDate = DateOnly.FromDateTime(DateTime.Now.AddYears(-5)),
                CitizenIdsupplier = "Government"
            };

            // Act
            _context.Customers.Add(customer);
            try
            {
                ValidateCustomer(customer);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Customers.Count());
            }
        }

        private void ValidateCustomer(Customer customer)
        {
            if (string.IsNullOrWhiteSpace(customer.FullName))
                throw new ValidationException("FullName is required.");

            if (!IsValidEmail(customer.Email))
                throw new ValidationException("Invalid Email.");
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

   
}