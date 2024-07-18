using System.Collections.Generic;
using System.Linq;
using BCrypt.Net;
using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace cms_server.Tests
{
    public class ResetPassTests
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly AuthController _controller;
        private readonly IConfiguration _configuration;

        public ResetPassTests()
        {
            _mockContext = new Mock<CmsContext>();
            _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            _controller = new AuthController(_mockContext.Object, _configuration);
        }

        [Fact]
        public void RequestPasswordReset_EmailFoundForCustomer_ReturnsOkResult()
        {
            // Arrange
            var requestDto = new RequestPasswordResetDto { Email = "customer@example.com" };
            var customer = new Customer { CustomerId = 1, Email = "customer@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("oldpassword") };

            var customers = new List<Customer> { customer }.AsQueryable();

            var mockCustomerSet = new Mock<DbSet<Customer>>();
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Provider).Returns(customers.Provider);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Expression).Returns(customers.Expression);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.ElementType).Returns(customers.ElementType);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.GetEnumerator()).Returns(customers.GetEnumerator());

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);

            // Act
            var result = _controller.RequestPasswordReset(requestDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("A new password has been sent to your email.", okResult.Value);

            _mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }

      

        [Fact]
        public void RequestPasswordReset_EmailNotFound_ReturnsNotFoundResult()
        {
            // Arrange
            var requestDto = new RequestPasswordResetDto { Email = "notfound@example.com" };

            var customers = new List<Customer>().AsQueryable();
            var staffMembers = new List<Staff>().AsQueryable();

            var mockCustomerSet = new Mock<DbSet<Customer>>();
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Provider).Returns(customers.Provider);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Expression).Returns(customers.Expression);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.ElementType).Returns(customers.ElementType);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.GetEnumerator()).Returns(customers.GetEnumerator());

            var mockStaffSet = new Mock<DbSet<Staff>>();
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.Provider).Returns(staffMembers.Provider);
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.Expression).Returns(staffMembers.Expression);
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.ElementType).Returns(staffMembers.ElementType);
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.GetEnumerator()).Returns(staffMembers.GetEnumerator());

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);
            _mockContext.Setup(c => c.Staff).Returns(mockStaffSet.Object);

            // Act
            var result = _controller.RequestPasswordReset(requestDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Email not found.", notFoundResult.Value);
        }
    }
}
