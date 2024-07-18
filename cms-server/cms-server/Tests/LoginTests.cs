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
    public class AuthControllerTests
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly AuthController _controller;
        private readonly IConfiguration _configuration;

        public AuthControllerTests()
        {
            _mockContext = new Mock<CmsContext>();
            _configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            _controller = new AuthController(_mockContext.Object, _configuration);
        }

        [Fact]
        public void Login_ValidCustomerCredentials_ReturnsOkResult()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "customer@example.com", Password = "password123" };
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("password123");
            var customers = new List<Customer>
            {
                new Customer { CustomerId = 1, Email = "customer@example.com", PasswordHash = hashedPassword, Phone = "1234567890", Address = "123 Main St" }
            }.AsQueryable();

            var mockCustomerSet = new Mock<DbSet<Customer>>();
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Provider).Returns(customers.Provider);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Expression).Returns(customers.Expression);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.ElementType).Returns(customers.ElementType);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.GetEnumerator()).Returns(customers.GetEnumerator());

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);

            // Act
            var result = _controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;
            Assert.NotNull(returnValue);
            Assert.True(returnValue.GetType().GetProperty("Token") != null);
            Assert.True(returnValue.GetType().GetProperty("Role") != null);
            Assert.Equal("Customer", returnValue.GetType().GetProperty("Role").GetValue(returnValue));
        }

        [Fact]
        public void Login_ValidStaffCredentials_ReturnsOkResult()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "customer@example.com", Password = "password123" };
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("password123");
            var customers = new List<Customer>
            {
                new Customer { CustomerId = 1, Email = "customer@example.com", PasswordHash = hashedPassword, Phone = "1234567890", Address = "123 Main St" }
            }.AsQueryable();

            var mockCustomerSet = new Mock<DbSet<Customer>>();
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Provider).Returns(customers.Provider);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Expression).Returns(customers.Expression);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.ElementType).Returns(customers.ElementType);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.GetEnumerator()).Returns(customers.GetEnumerator());

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);

            // Act
            var result = _controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;
            Assert.NotNull(returnValue);
            Assert.True(returnValue.GetType().GetProperty("Token") != null);
            Assert.True(returnValue.GetType().GetProperty("Role") != null);
            Assert.Equal("Customer", returnValue.GetType().GetProperty("Role").GetValue(returnValue));
        }

        [Fact]
        public void Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "invalid@example.com", Password = "wrongpassword" };
            var customers = new List<Customer>().AsQueryable();
            var staff = new List<Staff>().AsQueryable();

            var mockCustomerSet = new Mock<DbSet<Customer>>();
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Provider).Returns(customers.Provider);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.Expression).Returns(customers.Expression);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.ElementType).Returns(customers.ElementType);
            mockCustomerSet.As<IQueryable<Customer>>().Setup(m => m.GetEnumerator()).Returns(customers.GetEnumerator());

            var mockStaffSet = new Mock<DbSet<Staff>>();
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.Provider).Returns(staff.Provider);
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.Expression).Returns(staff.Expression);
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.ElementType).Returns(staff.ElementType);
            mockStaffSet.As<IQueryable<Staff>>().Setup(m => m.GetEnumerator()).Returns(staff.GetEnumerator());

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);
            _mockContext.Setup(c => c.Staff).Returns(mockStaffSet.Object);

            // Act
            var result = _controller.Login(loginDto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid credentials.", unauthorizedResult.Value);
        }
    }
}
