using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateServiceOrderTests
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
        public void CreateServiceOrder_ValidData_ShouldCreateServiceOrder()
        {
            // Arrange
            var customer = new Customer { FullName = "John Doe", Email = "john.doe@example.com" };
            var niche = new Niche { NicheName = "Niche 1", AreaId = 1 };

            _context.Customers.Add(customer);
            _context.Niches.Add(niche);
            _context.SaveChanges();

            var serviceOrder = new ServiceOrder
            {
                CustomerId = customer.CustomerId,
                NicheId = niche.NicheId,
                OrderDate = DateTime.Now,
                StaffId = null,
                ServiceOrderCode = "SO001",
                CreatedDate = DateTime.Now
            };

            // Act
            _context.ServiceOrders.Add(serviceOrder);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.ServiceOrders.Count());
            Assert.AreEqual("SO001", _context.ServiceOrders.First().ServiceOrderCode);
        }

        [Test]
        public void CreateServiceOrder_InvalidData_ShouldFail()
        {
            // Arrange
            var serviceOrder = new ServiceOrder
            {
                CustomerId = 0, // Invalid CustomerId
                NicheId = 0, // Invalid NicheId
                OrderDate = DateTime.Now,
                StaffId = null,
                ServiceOrderCode = "SO001",
                CreatedDate = DateTime.Now
            };

            // Act
            _context.ServiceOrders.Add(serviceOrder);
            try
            {
                ValidateServiceOrder(serviceOrder);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.ServiceOrders.Count());
            }
        }

        private void ValidateServiceOrder(ServiceOrder serviceOrder)
        {
            if (!_context.Customers.Any(c => c.CustomerId == serviceOrder.CustomerId))
                throw new ValidationException("Invalid CustomerId.");

            if (!_context.Niches.Any(n => n.NicheId == serviceOrder.NicheId))
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