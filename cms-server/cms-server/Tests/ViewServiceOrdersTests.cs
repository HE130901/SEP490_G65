using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using cms_server.Controllers;
using cms_server.Models;
using Moq;
using System.Security.Claims;

namespace cms_server.Tests
{
    public class ServiceOrdersControllerTests9
    {
        private readonly CmsContext _context;
        private readonly ServiceOrdersController _controller;

        public ServiceOrdersControllerTests9()
        {
            var options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "CmsInMemoryDb")
                .Options;

            _context = new CmsContext(options);
            _controller = new ServiceOrdersController(_context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };

            SeedDatabase();
        }

        private void SeedDatabase()
        {
            var customer = new Customer
            {
                CustomerId = 1,
                FullName = "John Doe",
                Email = "john.doe@example.com",
                PasswordHash = "hashedpassword"
            };

            var niche = new Niche
            {
                NicheId = 1,
                NicheName = "Niche 1",
                Area = new Area
                {
                    AreaId = 1,
                    AreaName = "Area 1",
                    Floor = new Floor
                    {
                        FloorId = 1,
                        FloorName = "Floor 1",
                        Building = new Building
                        {
                            BuildingId = 1,
                            BuildingName = "Building 1"
                        }
                    }
                }
            };

            var service = new Service
            {
                ServiceId = 1,
                ServiceName = "Service 1",
                Price = 100m
            };

            var serviceOrder = new ServiceOrder
            {
                ServiceOrderId = 1,
                CustomerId = 1,
                NicheId = 1,
                CreatedDate = DateTime.Now,
                OrderDate = DateTime.Now,
                ServiceOrderDetails = new List<ServiceOrderDetail>
                {
                    new ServiceOrderDetail
                    {
                        ServiceOrderId = 1,
                        ServiceId = 1,
                        Quantity = 2,
                        Status = "Completed",
                        Service = service
                    }
                }
            };

            _context.Customers.Add(customer);
            _context.Niches.Add(niche);
            _context.Services.Add(service);
            _context.ServiceOrders.Add(serviceOrder);
            _context.SaveChanges();
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
        public async Task GetServiceOrdersByCustomer_ValidRequest_ReturnsServiceOrders()
        {
            // Arrange
            SetupUserClaims("1");

            // Act
            var result = await _controller.GetServiceOrdersByCustomer();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<ServiceOrderResponseDto>>(okResult.Value);
            Assert.Single(returnValue);
            Assert.Equal(1, returnValue.First().ServiceOrderId);
            Assert.Equal("Building 1-Floor 1-Area 1-Niche 1", returnValue.First().NicheAddress);
        }

        [Fact]
        public async Task GetServiceOrdersByCustomer_NoCustomerIdClaim_ReturnsUnauthorized()
        {
            // Arrange
            var mockUser = new ClaimsPrincipal(new ClaimsIdentity(new Claim[0]));
            _controller.ControllerContext.HttpContext.User = mockUser;

            // Act
            var result = await _controller.GetServiceOrdersByCustomer();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("Customer ID not found in token", unauthorizedResult.Value);
        }

        [Fact]
        public async Task GetServiceOrdersByCustomer_NoServiceOrders_ReturnsNotFound()
        {
            // Arrange
            SetupUserClaims("2"); // Sử dụng customerId không có service orders

            // Act
            var result = await _controller.GetServiceOrdersByCustomer();

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result.Result);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
