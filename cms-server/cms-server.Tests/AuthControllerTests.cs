using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Moq;
using NUnit.Framework;

namespace cms_server.Tests
{
    [TestFixture]
    public class AuthControllerTests
    {
        private Mock<CmsContext> _contextMock;
        private Mock<IConfiguration> _configurationMock;
        private AuthController _controller;

        [SetUp]
        public void Setup()
        {
            _contextMock = new Mock<CmsContext>();
            _configurationMock = new Mock<IConfiguration>();
            _controller = new AuthController(_contextMock.Object, _configurationMock.Object);

            _configurationMock.Setup(config => config["Jwt:Key"]).Returns("verysecretkey123456");
            _configurationMock.Setup(config => config["Jwt:Issuer"]).Returns("http://issuer.com");
            _configurationMock.Setup(config => config["Jwt:Audience"]).Returns("http://audience.com");
            _configurationMock.Setup(config => config["SmtpSettings:SenderName"]).Returns("Test Sender");
            _configurationMock.Setup(config => config["SmtpSettings:SenderEmail"]).Returns("sender@test.com");
            _configurationMock.Setup(config => config["SmtpSettings:Server"]).Returns("smtp.test.com");
            _configurationMock.Setup(config => config["SmtpSettings:Port"]).Returns("587");
            _configurationMock.Setup(config => config["SmtpSettings:Username"]).Returns("username");
            _configurationMock.Setup(config => config["SmtpSettings:Password"]).Returns("password");
        }

        [Test]
        public void Login_ReturnsOk_WhenCustomerCredentialsAreValid()
        {
            var loginDto = new LoginDto { Email = "customer@test.com", Password = "password" };
            var customer = new Customer { CustomerId = 1, Email = "customer@test.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("password") };

            var customersDbSet = new List<Customer> { customer }.AsQueryable().BuildMockDbSet();
            _contextMock.Setup(c => c.Customers).Returns(customersDbSet.Object);

            var result = _controller.Login(loginDto) as OkObjectResult;

            NUnit.Framework.Assert.NotNull(result);
            NUnit.Framework.Assert.AreEqual(200, result.StatusCode);
            NUnit.Framework.Assert.IsTrue(result.Value.ToString().Contains("Token"));
            NUnit.Framework.Assert.IsTrue(result.Value.ToString().Contains("Role"));
        }

        [Test]
        public void Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
        {
            var loginDto = new LoginDto { Email = "wrong@test.com", Password = "password" };

            var customersDbSet = new List<Customer>().AsQueryable().BuildMockDbSet();
            var staffDbSet = new List<Staff>().AsQueryable().BuildMockDbSet();
            _contextMock.Setup(c => c.Customers).Returns(customersDbSet.Object);
            _contextMock.Setup(c => c.Staff).Returns(staffDbSet.Object);

            var result = _controller.Login(loginDto);

            NUnit.Framework.Assert.IsInstanceOf<UnauthorizedObjectResult>(result);
        }

        [Test]
        public async Task Register_ReturnsOk_WhenRegistrationIsSuccessful()
        {
            var registerDto = new RegisterDto
            {
                FullName = "Test User",
                Email = "newuser@test.com",
                Phone = "123456789",
                Address = "Test Address",
                Password = "password",
                CitizenId = "123456789"
            };

            var customersDbSet = new List<Customer>().AsQueryable().BuildMockDbSet();
            _contextMock.Setup(c => c.Customers).Returns(customersDbSet.Object);

            var result = await _controller.Register(registerDto) as OkObjectResult;

            NUnit.Framework.Assert.NotNull(result);
            NUnit.Framework.Assert.AreEqual(200, result.StatusCode);
            NUnit.Framework.Assert.AreEqual("Registration successful.", result.Value);
        }

        [Test]
        public async Task Register_ReturnsBadRequest_WhenEmailIsAlreadyInUse()
        {
            var registerDto = new RegisterDto
            {
                FullName = "Test User",
                Email = "existing@test.com",
                Phone = "123456789",
                Address = "Test Address",
                Password = "password",
                CitizenId = "123456789"
            };

            var existingCustomer = new Customer { Email = "existing@test.com" };
            var customersDbSet = new List<Customer> { existingCustomer }.AsQueryable().BuildMockDbSet();
            _contextMock.Setup(c => c.Customers).Returns(customersDbSet.Object);

            var result = await _controller.Register(registerDto);

            NUnit.Framework.Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public void GetCurrentUser_ReturnsOk_WhenUserIsCustomer()
        {
            var userId = "1";
            var customer = new Customer { CustomerId = 1, FullName = "Test User", Email = "user@test.com", Phone = "123456789", Address = "Test Address", CitizenId = "123456789" };

            var customersDbSet = new List<Customer> { customer }.AsQueryable().BuildMockDbSet();
            _contextMock.Setup(c => c.Customers).Returns(customersDbSet.Object);

            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId) };
            var identity = new ClaimsIdentity(claims);
            var user = new ClaimsPrincipal(identity);
            _controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };

            var result = _controller.GetCurrentUser() as OkObjectResult;

            NUnit.Framework.Assert.NotNull(result);
            NUnit.Framework.Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void RequestPasswordReset_ReturnsNotFound_WhenEmailNotFound()
        {
            var requestDto = new RequestPasswordResetDto { Email = "notfound@test.com" };

            var customersDbSet = new List<Customer>().AsQueryable().BuildMockDbSet();
            var staffDbSet = new List<Staff>().AsQueryable().BuildMockDbSet();
            _contextMock.Setup(c => c.Customers).Returns(customersDbSet.Object);
            _contextMock.Setup(c => c.Staff).Returns(staffDbSet.Object);

            var result = _controller.RequestPasswordReset(requestDto);

            NUnit.Framework.Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public void RequestPasswordReset_SendsEmail_WhenEmailFound()
        {
            var requestDto = new RequestPasswordResetDto { Email = "customer@test.com" };
            var customer = new Customer { Email = "customer@test.com" };

            var customersDbSet = new List<Customer> { customer }.AsQueryable().BuildMockDbSet();
            _contextMock.Setup(c => c.Customers).Returns(customersDbSet.Object);

            var smtpClientMock = new Mock<SmtpClient>();

            var result = _controller.RequestPasswordReset(requestDto) as OkObjectResult;

            NUnit.Framework.Assert.NotNull(result);
            NUnit.Framework.Assert.AreEqual(200, result.StatusCode);
        }
    }

    public static class DbSetMockingExtensions
    {
        public static Mock<DbSet<T>> BuildMockDbSet<T>(this IQueryable<T> data) where T : class
        {
            var mock = new Mock<DbSet<T>>();
            mock.As<IQueryable<T>>().Setup(m => m.Provider).Returns(data.Provider);
            mock.As<IQueryable<T>>().Setup(m => m.Expression).Returns(data.Expression);
            mock.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mock.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
            return mock;
        }
    }
}
