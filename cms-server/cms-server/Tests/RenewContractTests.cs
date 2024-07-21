using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Moq;
using cms_server.Controllers;
using cms_server.Models;

namespace cms_server.Tests
{
    public class ContractsControllerTests78
    {
        private readonly CmsContext _context;
        private readonly ContractsController _controller;

        public ContractsControllerTests78()
        {
            var options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "CmsInMemoryDb")
                .Options;

            _context = new CmsContext(options);
            _controller = new ContractsController(_context)
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
                Phone = "123456789",
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

            var contract = new Contract
            {
                ContractId = 1,
                CustomerId = 1,
                Customer = customer,
                NicheId = 1,
                Niche = niche,
                StartDate = DateOnly.MaxValue,
                Status = "Active"
            };

            _context.Customers.Add(customer);
            _context.Niches.Add(niche);
            _context.Contracts.Add(contract);
            _context.SaveChanges();
        }

        private void SetupUserClaims(string customerId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, customerId)
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            _controller.ControllerContext.HttpContext.User = claimsPrincipal;
        }

        [Fact]
        public async Task RenewContract_ValidRequest_ReturnsNoContent()
        {
            // Arrange
            SetupUserClaims("1");
            var renewalRequest = new ContractRenewalRequestDto
            {
                ContractId = 1,
                Note = "Renewal Note",
                ConfirmationDate = DateTime.Now,
                SignAddress = "123 Main St"
            };

            // Act
            var result = await _controller.RenewContract(renewalRequest);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var contract = await _context.Contracts.FindAsync(1);
            Assert.Equal("PendingRenewal", contract.Status);
        }

        [Fact]
        public async Task RenewContract_NullRequest_ReturnsBadRequest()
        {
            // Arrange
            SetupUserClaims("1");

            // Act
            var result = await _controller.RenewContract(null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Renewal request cannot be null.", badRequestResult.Value);
        }

        [Fact]
        public async Task RenewContract_NoUserIdClaim_ReturnsUnauthorized()
        {
            // Arrange
            var mockUser = new ClaimsPrincipal(new ClaimsIdentity(new Claim[0]));
            _controller.ControllerContext.HttpContext.User = mockUser;
            var renewalRequest = new ContractRenewalRequestDto
            {
                ContractId = 1,
                Note = "Renewal Note",
                ConfirmationDate = DateTime.Now,
                SignAddress = "123 Main St"
            };

            // Act
            var result = await _controller.RenewContract(renewalRequest);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("User ID not found in token.", unauthorizedResult.Value);
        }

        [Fact]
        public async Task RenewContract_InvalidUserIdClaim_ReturnsUnauthorized()
        {
            // Arrange
            SetupUserClaims("invalid");
            var renewalRequest = new ContractRenewalRequestDto
            {
                ContractId = 1,
                Note = "Renewal Note",
                ConfirmationDate = DateTime.Now,
                SignAddress = "123 Main St"
            };

            // Act
            var result = await _controller.RenewContract(renewalRequest);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid user ID in token.", unauthorizedResult.Value);
        }

        [Fact]
        public async Task RenewContract_ContractNotFound_ReturnsNotFound()
        {
            // Arrange
            SetupUserClaims("1");
            var renewalRequest = new ContractRenewalRequestDto
            {
                ContractId = 999,
                Note = "Renewal Note",
                ConfirmationDate = DateTime.Now,
                SignAddress = "123 Main St"
            };

            // Act
            var result = await _controller.RenewContract(renewalRequest);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Contract not found.", notFoundResult.Value);
        }

        [Fact]
        public async Task RenewContract_InvalidContractData_ReturnsBadRequest()
        {
            // Arrange
            SetupUserClaims("1");
            var renewalRequest = new ContractRenewalRequestDto
            {
                ContractId = 1,
                Note = "Renewal Note",
                ConfirmationDate = DateTime.Now,
                SignAddress = "123 Main St"
            };

            // Act
            var contract = await _context.Contracts.FindAsync(1);
            contract.Customer = null; // Làm cho dữ liệu hợp đồng không hợp lệ
            await _context.SaveChangesAsync();

            var result = await _controller.RenewContract(renewalRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid contract data.", badRequestResult.Value);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
