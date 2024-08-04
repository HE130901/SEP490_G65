using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateNotificationTests
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
        public void CreateNotification_ValidData_ShouldCreateNotification()
        {
            // Arrange
            var customer = new Customer { FullName = "John Doe", Email = "john.doe@example.com" };
            var staff = new Staff { FullName = "Jane Smith", PasswordHash = "hashed_password", Email = "jane.smith@example.com" };
            var serviceOrder = new ServiceOrder { CustomerId = customer.CustomerId, NicheId = 1, OrderDate = DateTime.Now, ServiceOrderCode = "SO001", CreatedDate = DateTime.Now };
            var visit = new VisitRegistration { CustomerId = customer.CustomerId, NicheId = 1, VisitDate = DateTime.Now, Status = "Pending", CreatedDate = DateTime.Now };

            _context.Customers.Add(customer);
            _context.Staff.Add(staff);
            _context.ServiceOrders.Add(serviceOrder);
            _context.VisitRegistrations.Add(visit);
            _context.SaveChanges();

            var notification = new Notification
            {
                CustomerId = customer.CustomerId,
                StaffId = staff.StaffId,
                ServiceOrderId = serviceOrder.ServiceOrderId,
                VisitId = visit.VisitId,
                NotificationDate = DateTime.Now,
                Message = "Your visit has been scheduled."
            };

            // Act
            _context.Notifications.Add(notification);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Notifications.Count());
            Assert.AreEqual("Your visit has been scheduled.", _context.Notifications.First().Message);
        }

        [Test]
        public void CreateNotification_InvalidData_ShouldFail()
        {
            // Arrange
            var notification = new Notification
            {
                CustomerId = 0, // Invalid CustomerId
                StaffId = 0, // Invalid StaffId
                ServiceOrderId = 0, // Invalid ServiceOrderId
                VisitId = 0, // Invalid VisitId
                NotificationDate = DateTime.Now,
                Message = "Your visit has been scheduled."
            };

            // Act
            _context.Notifications.Add(notification);
            try
            {
                ValidateNotification(notification);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Notifications.Count());
            }
        }

        private void ValidateNotification(Notification notification)
        {
            if (notification.CustomerId != null && !_context.Customers.Any(c => c.CustomerId == notification.CustomerId))
                throw new ValidationException("Invalid CustomerId.");

            if (notification.StaffId != null && !_context.Staff.Any(s => s.StaffId == notification.StaffId))
                throw new ValidationException("Invalid StaffId.");

            if (notification.ServiceOrderId != null && !_context.ServiceOrders.Any(so => so.ServiceOrderId == notification.ServiceOrderId))
                throw new ValidationException("Invalid ServiceOrderId.");

            if (notification.VisitId != null && !_context.VisitRegistrations.Any(v => v.VisitId == notification.VisitId))
                throw new ValidationException("Invalid VisitId.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

   
}