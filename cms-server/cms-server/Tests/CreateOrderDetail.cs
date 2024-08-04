using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateServiceOrderDetailTests
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
        public void CreateServiceOrderDetail_ValidData_ShouldCreateServiceOrderDetail()
        {
            // Arrange
            var customer = new Customer { FullName = "John Doe", Email = "john.doe@example.com" };
            var niche = new Niche { NicheName = "Niche 1", AreaId = 1 };
            var service = new Service { ServiceName = "Cleaning Service", Price = 100.00m };
            var serviceOrder = new ServiceOrder
            {
                CustomerId = customer.CustomerId,
                NicheId = niche.NicheId,
                OrderDate = DateTime.Now,
                ServiceOrderCode = "SO001",
                CreatedDate = DateTime.Now
            };

            _context.Customers.Add(customer);
            _context.Niches.Add(niche);
            _context.Services.Add(service);
            _context.ServiceOrders.Add(serviceOrder);
            _context.SaveChanges();

            var serviceOrderDetail = new ServiceOrderDetail
            {
                ServiceOrderId = serviceOrder.ServiceOrderId,
                ServiceId = service.ServiceId,
                Quantity = 2,
                CompletionImage = "image_url",
                Status = "Pending"
            };

            // Act
            _context.ServiceOrderDetails.Add(serviceOrderDetail);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.ServiceOrderDetails.Count());
            Assert.AreEqual("Pending", _context.ServiceOrderDetails.First().Status);
        }

        [Test]
        public void CreateServiceOrderDetail_InvalidData_ShouldFail()
        {
            // Arrange
            var serviceOrderDetail = new ServiceOrderDetail
            {
                ServiceOrderId = 0, // Invalid ServiceOrderId
                ServiceId = 0, // Invalid ServiceId
                Quantity = 2,
                CompletionImage = "image_url",
                Status = "Pending"
            };

            // Act
            _context.ServiceOrderDetails.Add(serviceOrderDetail);
            try
            {
                ValidateServiceOrderDetail(serviceOrderDetail);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.ServiceOrderDetails.Count());
            }
        }

        private void ValidateServiceOrderDetail(ServiceOrderDetail serviceOrderDetail)
        {
            if (!_context.ServiceOrders.Any(so => so.ServiceOrderId == serviceOrderDetail.ServiceOrderId))
                throw new ValidationException("Invalid ServiceOrderId.");

            if (!_context.Services.Any(s => s.ServiceId == serviceOrderDetail.ServiceId))
                throw new ValidationException("Invalid ServiceId.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

  
}