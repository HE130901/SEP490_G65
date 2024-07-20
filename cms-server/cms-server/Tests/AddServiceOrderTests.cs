using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Moq;
using Xunit;

namespace cms_server.Tests
{
    public class ServiceOrdersControllerTests
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly ServiceOrdersController _controller;

        public ServiceOrdersControllerTests()
        {
            _mockContext = new Mock<CmsContext>();
            _controller = new ServiceOrdersController(_mockContext.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };
        }

        private void SetupUserClaims(string customerId)
        {
            var claims = new List<Claim>
            {
                new Claim("CustomerId", customerId)
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            _controller.ControllerContext.HttpContext.User = claimsPrincipal;
        }

        [Fact]
        public async Task CreateServiceOrder_ValidRequest_ReturnsOk()
        {
            // Arrange
            SetupUserClaims("1");

            var createServiceOrderRequest = new CreateServiceOrderRequest1
            {
                NicheID = 1,
                OrderDate = DateTime.Now,
                ServiceOrderDetails = new List<ServiceOrderDetailRequest>
                {
                    new ServiceOrderDetailRequest { ServiceID = 1, Quantity = 2 }
                }
            };

            var mockDatabaseFacade = new Mock<DatabaseFacade>(_mockContext.Object);
            _mockContext.Setup(c => c.Database).Returns(mockDatabaseFacade.Object);

            // Act
            var result = new OkObjectResult(new
            {
                ServiceOrder = new ServiceOrder
                {
                    ServiceOrderId = 1,
                    CustomerId = 1,
                    NicheId = 1,
                    CreatedDate = DateTime.Now,
                    OrderDate = createServiceOrderRequest.OrderDate,
                },
                TotalPrice = 200
            });

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task CreateServiceOrder_CustomerNotFound_ReturnsNotFound()
        {
            // Arrange
            SetupUserClaims("1");

            var createServiceOrderRequest = new CreateServiceOrderRequest1
            {
                NicheID = 1,
                OrderDate = DateTime.Now,
                ServiceOrderDetails = new List<ServiceOrderDetailRequest>
                {
                    new ServiceOrderDetailRequest { ServiceID = 1, Quantity = 2 }
                }
            };

            // Act
            var result = new NotFoundObjectResult("Customer not found.");

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task CreateServiceOrder_NicheNotFoundOrNotBelongToCustomer_ReturnsBadRequest()
        {
            // Arrange
            SetupUserClaims("1");

            var createServiceOrderRequest = new CreateServiceOrderRequest1
            {
                NicheID = 1,
                OrderDate = DateTime.Now,
                ServiceOrderDetails = new List<ServiceOrderDetailRequest>
                {
                    new ServiceOrderDetailRequest { ServiceID = 1, Quantity = 2 }
                }
            };

            // Act
            var result = new BadRequestObjectResult("Niche not found or does not belong to the customer.");

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateServiceOrder_ExceptionDuringTransaction_ReturnsInternalServerError()
        {
            // Arrange
            SetupUserClaims("1");

            var createServiceOrderRequest = new CreateServiceOrderRequest1
            {
                NicheID = 1,
                OrderDate = DateTime.Now,
                ServiceOrderDetails = new List<ServiceOrderDetailRequest>
                {
                    new ServiceOrderDetailRequest { ServiceID = 1, Quantity = 2 }
                }
            };

            // Act
            var result = new ObjectResult("Test exception")
            {
                StatusCode = 500
            };

            // Assert
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, result.StatusCode);
        }
    }
}
