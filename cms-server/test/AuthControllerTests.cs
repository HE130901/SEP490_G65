using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Models;

namespace test
{
    [TestFixture]
    public class AuthControllerTests
    {
        private Mock<CmsContext> _mockContext;
        private Mock<IConfiguration> _mockConfiguration;
        private AuthController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<CmsContext>();
            _mockConfiguration = new Mock<IConfiguration>();
            _controller = new AuthController(_mockContext.Object, _mockConfiguration.Object);
        }

        private static Mock<DbSet<T>> CreateMockDbSet<T>(IQueryable<T> data) where T : class
        {
            var mockSet = new Mock<DbSet<T>>();
            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
            return mockSet;
        }

        [Test]
        public void Login_CustomerValidCredentials_ReturnsOkWithToken()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "customer@example.com", Password = "password" };
            var customer = new Customer
            {
                CustomerId = 1,
                Email = "customer@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                Phone = "1234567890",
                Address = "123 Street"
            };
            var customers = new List<Customer> { customer }.AsQueryable();
            var mockCustomerSet = CreateMockDbSet(customers);

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);
            _mockConfiguration.Setup(c => c["Jwt:Key"]).Returns("your_jwt_key_here");
            _mockConfiguration.Setup(c => c["Jwt:Issuer"]).Returns("your_issuer_here");
            _mockConfiguration.Setup(c => c["Jwt:Audience"]).Returns("your_audience_here");

            // Act
            var result = _controller.Login(loginDto);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult.Value);
            var tokenResponse = okResult.Value as dynamic;
            Assert.IsNotNull(tokenResponse.Token);
            Assert.AreEqual("Customer", tokenResponse.Role);
        }

        [Test]
        public async Task Register_NewCustomer_ReturnsOk()
        {
            // Arrange
            var registerDto = new RegisterDto
            {
                FullName = "New Customer",
                Email = "newcustomer@example.com",
                Password = "password",
                Phone = "1234567890",
                Address = "123 Street",
                CitizenId = "123456789"
            };
            var customers = new List<Customer>().AsQueryable();
            var mockCustomerSet = CreateMockDbSet(customers);

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);
            _mockContext.Setup(c => c.Customers.Add(It.IsAny<Customer>()));
            _mockContext.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>())).Returns(Task.FromResult(1));

            // Act
            var result = await _controller.Register(registerDto);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.AreEqual("Registration successful.", okResult.Value);
        }

        [Test]
        public void GetCurrentUser_Customer_ReturnsOkWithUserDetails()
        {
            // Arrange
            var userId = "1";
            var customer = new Customer
            {
                CustomerId = 1,
                FullName = "Existing Customer",
                Email = "existingcustomer@example.com",
                Phone = "1234567890",
                Address = "123 Street"
            };
            var customers = new List<Customer> { customer }.AsQueryable();
            var mockCustomerSet = CreateMockDbSet(customers);

            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };
            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);

            // Act
            var result = _controller.GetCurrentUser();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult.Value);

            // Use a strongly-typed object for the response
            var userResponse = okResult.Value as CustomerDetailsDto;
            Assert.AreEqual(customer.CustomerId, userResponse.CustomerId);
            Assert.AreEqual(customer.FullName, userResponse.FullName);
            Assert.AreEqual(customer.Email, userResponse.Email);
        }

        [Test]
        public void RequestPasswordReset_CustomerEmailExists_ReturnsOk()
        {
            // Arrange
            var requestDto = new RequestPasswordResetDto { Email = "customer@example.com" };
            var customer = new Customer
            {
                CustomerId = 1,
                Email = "customer@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("oldpassword")
            };
            var customers = new List<Customer> { customer }.AsQueryable();
            var mockCustomerSet = CreateMockDbSet(customers);

            _mockContext.Setup(c => c.Customers).Returns(mockCustomerSet.Object);
            _mockConfiguration.Setup(c => c["SmtpSettings:SenderName"]).Returns("Test Sender");
            _mockConfiguration.Setup(c => c["SmtpSettings:SenderEmail"]).Returns("sender@example.com");
            _mockConfiguration.Setup(c => c["SmtpSettings:Server"]).Returns("smtp.example.com");
            _mockConfiguration.Setup(c => c["SmtpSettings:Port"]).Returns("587");
            _mockConfiguration.Setup(c => c["SmtpSettings:Username"]).Returns("smtpuser");
            _mockConfiguration.Setup(c => c["SmtpSettings:Password"]).Returns("smtppassword");

            // Act
            var result = _controller.RequestPasswordReset(requestDto);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.AreEqual("A new password has been sent to your email.", okResult.Value);
        }
    }

    // Define a DTO for the GetCurrentUser response
    public class CustomerDetailsDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string CitizenId { get; set; }
    }
}
