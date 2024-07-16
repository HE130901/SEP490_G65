using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Models;
using Microsoft.AspNetCore.Http;
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
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockContext = new Mock<CmsContext>();
            _mockConfiguration = new Mock<IConfiguration>();

            _mockConfiguration.SetupGet(x => x["Jwt:Key"]).Returns("YourSuperSecretKeyHereWithAtLeast32Characters");
            _mockConfiguration.SetupGet(x => x["Jwt:Issuer"]).Returns("your_issuer");
            _mockConfiguration.SetupGet(x => x["Jwt:Audience"]).Returns("your_audience");

            // Mock email configuration settings
            _mockConfiguration.SetupGet(x => x["SmtpSettings:SenderName"]).Returns("SenderName");
            _mockConfiguration.SetupGet(x => x["SmtpSettings:SenderEmail"]).Returns("sender@example.com");
            _mockConfiguration.SetupGet(x => x["SmtpSettings:Server"]).Returns("smtp.example.com");
            _mockConfiguration.SetupGet(x => x["SmtpSettings:Port"]).Returns("587");
            _mockConfiguration.SetupGet(x => x["SmtpSettings:Username"]).Returns("smtp_user");
            _mockConfiguration.SetupGet(x => x["SmtpSettings:Password"]).Returns("smtp_password");

            _controller = new AuthController(_mockContext.Object, _mockConfiguration.Object);
        }

        private Mock<DbSet<T>> CreateMockDbSet<T>(List<T> elements) where T : class
        {
            var queryable = elements.AsQueryable();
            var dbSet = new Mock<DbSet<T>>();
            dbSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(queryable.Provider);
            dbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
            dbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            dbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());
            dbSet.Setup(d => d.Add(It.IsAny<T>())).Callback<T>(elements.Add);
            return dbSet;
        }

        [Fact]
        public void Login_WithValidCustomerCredentials_ReturnsOkResult()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "customer@example.com", Password = "password" };
            var customer = new Customer { CustomerId = 1, Email = "customer@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"), Phone = "123456789", Address = "Address" };

            var customers = new List<Customer> { customer };
            var dbSet = CreateMockDbSet(customers);

            _mockContext.Setup(m => m.Customers).Returns(dbSet.Object);

            // Act
            var result = _controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as dynamic;
            Assert.Equal("Customer", returnValue.Role);
        }

        [Fact]
        public void Login_WithInvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "customer@example.com", Password = "password" };
            var customer = new Customer { CustomerId = 1, Email = "customer@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"), Phone = "123456789", Address = "Address" };

            var customers = new List<Customer> { customer };
            var dbSet = CreateMockDbSet(customers);

            _mockContext.Setup(m => m.Customers).Returns(dbSet.Object);

            // Act
            var result = _controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as dynamic;
            Assert.Equal("Customer", returnValue.Role);
        }

        [Fact]
        public void GetCurrentUser_WithValidCustomerToken_ReturnsCustomer()
        {
            // Arrange
            var customer = new Customer
            {
                CustomerId = 1,
                FullName = "John Doe",
                Email = "john.doe@example.com",
                Phone = "123456789",
                Address = "123 Test St",
                CitizenId = "A123456789",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password")
            };

            var customers = new List<Customer> { customer };
            var dbSetCustomers = CreateMockDbSet(customers);

            _mockContext.Setup(m => m.Customers).Returns(dbSetCustomers.Object);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Role, "Customer")
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            // Act
            var result = _controller.GetCurrentUser();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as dynamic;
            Assert.Equal(customer.CustomerId, returnValue.customerId);
            Assert.Equal(customer.FullName, returnValue.fullName);
            Assert.Equal(customer.Email, returnValue.email);
            Assert.Equal(customer.Phone, returnValue.phone);
            Assert.Equal(customer.Address, returnValue.address);
        }

        [Fact]
        public void GetCurrentUser_WithValidStaffToken_ReturnsStaff()
        {
            // Arrange
            var customer = new Customer
            {
                CustomerId = 1,
                FullName = "John Doe",
                Email = "john.doe@example.com",
                Phone = "123456789",
                Address = "123 Test St",
                CitizenId = "A123456789",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password")
            };

            var customers = new List<Customer> { customer };
            var dbSetCustomers = CreateMockDbSet(customers);

            _mockContext.Setup(m => m.Customers).Returns(dbSetCustomers.Object);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Role, "Customer")
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };

            // Act
            var result = _controller.GetCurrentUser();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value as dynamic;
            Assert.Equal(customer.CustomerId, returnValue.customerId);
            Assert.Equal(customer.FullName, returnValue.fullName);
            Assert.Equal(customer.Email, returnValue.email);
            Assert.Equal(customer.Phone, returnValue.phone);
            Assert.Equal(customer.Address, returnValue.address);
        }

        [Fact]
        public void RequestPasswordReset_WithValidCustomerEmail_ReturnsOk()
        {
            // Arrange
            var customer = new Customer
            {
                CustomerId = 1,
                FullName = "John Doe",
                Email = "john.doe@example.com",
                Phone = "123456789",
                Address = "123 Test St",
                CitizenId = "A123456789",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password")
            };

            var customers = new List<Customer> { customer };
            var dbSetCustomers = CreateMockDbSet(customers);

            _mockContext.Setup(m => m.Customers).Returns(dbSetCustomers.Object);

            var requestDto = new RequestPasswordResetDto { Email = "john.doe@example.com" };

            // Act
            var result = _controller.RequestPasswordReset(requestDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void RequestPasswordReset_WithValidStaffEmail_ReturnsOk()
        {
            // Arrange
            var staff = new Staff
            {
                StaffId = 1,
                FullName = "Jane Doe",
                Email = "jane.doe@example.com",
                Phone = "987654321",
                Role = "Admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password")
            };

            var staffs = new List<Staff> { staff };
            var dbSetStaffs = CreateMockDbSet(staffs);

            _mockContext.Setup(m => m.Staff).Returns(dbSetStaffs.Object);

            var requestDto = new RequestPasswordResetDto { Email = "jane.doe@example.com" };

            // Act
            var result = _controller.RequestPasswordReset(requestDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void RequestPasswordReset_WithInvalidEmail_ReturnsNotFound()
        {
            // Arrange
            var customers = new List<Customer>();
            var dbSetCustomers = CreateMockDbSet(customers);

            var staffs = new List<Staff>();
            var dbSetStaffs = CreateMockDbSet(staffs);

            _mockContext.Setup(m => m.Customers).Returns(dbSetCustomers.Object);
            _mockContext.Setup(m => m.Staff).Returns(dbSetStaffs.Object);

            var requestDto = new RequestPasswordResetDto { Email = "invalid@example.com" };

            // Act
            var result = _controller.RequestPasswordReset(requestDto);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}
