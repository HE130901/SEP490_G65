using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.Models;
using cms_server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace cms_server.Tests
{
    public class ContractForStaffControllerTests
    {
        private readonly DbContextOptions<CmsContext> _dbContextOptions;

        public ContractForStaffControllerTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(warnings =>
                    warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;
        }

        private CmsContext CreateContext()
        {
            return new CmsContext(_dbContextOptions);
        }

        [Fact]
        public async Task CreateContract_CreatesNewContract()
        {
            // Arrange
            var request = new CreateContractRequest
            {
                CustomerFullName = "John Doe",
                CustomerPhoneNumber = "123456789",
                CustomerEmail = "john.doe@test.com",
                CustomerAddress = "123 Test St",
                CustomerCitizenId = "A123456789",
                CustomerCitizenIdIssueDate = new DateOnly(2020, 1, 1),
                CustomerCitizenIdSupplier = "Gov",
                DeceasedFullName = "Jane Doe",
                DeceasedCitizenId = "B123456789",
                DeceasedDateOfBirth = new DateOnly(1950, 1, 1),
                DeceasedDateOfDeath = new DateOnly(2020, 1, 1),
                DeathCertificateNumber = "DC123456",
                DeathCertificateSupplier = "Hospital",
                RelationshipWithCustomer = "Mother",
                NicheID = 1,
                StaffID = 1,
                StartDate = new DateOnly(2020, 1, 1),
                EndDate = new DateOnly(2030, 1, 1),
                Note = "Test note",
                TotalAmount = 1000m
            };

            using (var context = CreateContext())
            {
                context.Niches.Add(new Niche
                {
                    NicheId = 1,
                    NicheName = "Niche1",
                    Status = "Available",
                    Area = new Area
                    {
                        Floor = new Floor
                        {
                            Building = new Building
                            {
                                BuildingName = "Building1"
                            },
                            FloorName = "Floor1"
                        },
                        AreaName = "Area1"
                    }
                });
                await context.SaveChangesAsync();
            }

            using (var context = CreateContext())
            {
                var controller = new ContractForStaffController(context);

                // Act
                var result = await controller.CreateContract(request);

                // Assert
                var createdResult = Assert.IsType<OkObjectResult>(result);
                var contract = Assert.IsType<Contract>(createdResult.Value);

                Assert.Equal(request.CustomerFullName, contract.Customer.FullName);
                Assert.Equal(request.TotalAmount, contract.TotalAmount);
                Assert.Equal("Unavailable", context.Niches.First().Status);
            }
        }

        [Fact]
        public async Task GetAllContracts_ReturnsAllContracts()
        {
            // Arrange
            using (var context = CreateContext())
            {
                context.Contracts.Add(new Contract
                {
                    ContractId = 1,
                    Customer = new Customer
                    {
                        FullName = "John Doe",
                        Email = "john.doe@test.com", // Ensure Email is set
                        PasswordHash = "$2a$11$nUOFWiAMFi4zIAbIkYAbcuhFx3JYvT4ELKpBE6kh7IN5S9/wsfk4q", // Default password
                        Phone = "123456789",
                        Address = "123 Test St",
                        CitizenId = "A123456789",
                        CitizenIdissuanceDate = new DateOnly(2020, 1, 1),
                        CitizenIdsupplier = "Gov"
                    },
                    Niche = new Niche
                    {
                        NicheName = "Niche1",
                        Area = new Area
                        {
                            AreaName = "Area1",
                            Floor = new Floor
                            {
                                FloorName = "Floor1",
                                Building = new Building
                                {
                                    BuildingName = "Building1"
                                }
                            }
                        }
                    },
                    StartDate = new DateOnly(2020, 1, 1),
                    EndDate = new DateOnly(2030, 1, 1),
                    Status = "Active"
                });
                await context.SaveChangesAsync();
            }

            using (var context = CreateContext())
            {
                var controller = new ContractForStaffController(context);

                // Act
                var result = await controller.GetAllContracts();

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result);
                var contracts = Assert.IsType<List<ContractForStaffDto>>(okResult.Value);

                Assert.Single(contracts);
                Assert.Equal("John Doe", contracts.First().CustomerName);
            }
        }

        [Fact]
        public async Task GetContractById_ReturnsCorrectContract()
        {
            // Arrange
            using (var context = CreateContext())
            {
                context.Contracts.Add(new Contract
                {
                    ContractId = 1,
                    Customer = new Customer
                    {
                        FullName = "John Doe",
                        Email = "john.doe@test.com", // Ensure Email is set
                        PasswordHash = "$2a$11$nUOFWiAMFi4zIAbIkYAbcuhFx3JYvT4ELKpBE6kh7IN5S9/wsfk4q", // Default password
                        Phone = "123456789",
                        Address = "123 Test St",
                        CitizenId = "A123456789",
                        CitizenIdissuanceDate = new DateOnly(2020, 1, 1),
                        CitizenIdsupplier = "Gov"
                    },
                    Niche = new Niche
                    {
                        NicheName = "Niche1",
                        Area = new Area
                        {
                            AreaName = "Area1",
                            Floor = new Floor
                            {
                                FloorName = "Floor1",
                                Building = new Building
                                {
                                    BuildingName = "Building1"
                                }
                            }
                        }
                    },
                    StartDate = new DateOnly(2020, 1, 1),
                    EndDate = new DateOnly(2030, 1, 1),
                    Status = "Active"
                });
                await context.SaveChangesAsync();
            }

            using (var context = CreateContext())
            {
                var controller = new ContractForStaffController(context);

                // Act
                var result = await controller.GetContractById(1);

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result);
                var contract = Assert.IsType<ContractForStaffDto>(okResult.Value);

                Assert.Equal(1, contract.ContractId);
                Assert.Equal("John Doe", contract.CustomerName);
            }
        }
    }
}
