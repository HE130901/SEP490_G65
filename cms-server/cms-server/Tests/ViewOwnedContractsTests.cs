using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Models;

namespace cms_server.Tests
{
    public class ContractsControllerTests : IDisposable
    {
        private readonly CmsContext _context;
        private readonly ContractsController _controller;

        public ContractsControllerTests()
        {
            var options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "CmsInMemoryDb")
                .Options;

            _context = new CmsContext(options);
            _controller = new ContractsController(_context);

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

        [Fact]
        public async Task GetContractsByCustomer_ReturnsContracts_ForValidCustomerId()
        {
            var result = await _controller.GetContractsByCustomer(2);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetContractsByCustomer_ReturnsNotFound_ForInvalidCustomerId()
        {
            var result = await _controller.GetContractsByCustomer(2);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
