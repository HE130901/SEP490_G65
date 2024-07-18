using cms_server.Controllers;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace CmsServer.Tests
{
    public class BuildingsControllerTests
    {
        private readonly DbContextOptions<CmsContext> _options;
        private readonly CmsContext _context;
        private readonly BuildingsController _controller;

        public BuildingsControllerTests()
        {
            _options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new CmsContext(_options);
            _controller = new BuildingsController(_context);

            // Seed the database with test data
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            if (_context.Buildings.Any())
            {
                return; // Database has been seeded
            }

            var building = new Building
            {
                BuildingId = 1,
                BuildingName = "Building 1",
                BuildingDescription = "Description 1",
                BuildingPicture = "Picture 1",
                Floors = new List<Floor>
                {
                    new Floor
                    {
                        FloorId = 1,
                        FloorName = "Floor 1",
                        Areas = new List<Area>
                        {
                            new Area
                            {
                                AreaId = 1,
                                AreaName = "Area 1"
                            }
                        }
                    }
                }
            };

            var niche = new Niche
            {
                NicheId = 1,
                NicheName = "Niche 1",
                Status = "Status 1",
                AreaId = 1,
                Area = building.Floors.First().Areas.First()
            };

            _context.Buildings.Add(building);
            _context.Niches.Add(niche);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetAllBuildingsFloorsAreas_ReturnsBuildingsFloorsAreasDto()
        {
            // Act
            var result = await _controller.GetAllBuildingsFloorsAreas();

            // Assert
            var okResult = Assert.IsType<ActionResult<BuildingsFloorsAreasDto>>(result);
            var returnValue = Assert.IsType<BuildingsFloorsAreasDto>(okResult.Value);
            Assert.Single(returnValue.Buildings);
            Assert.Single(returnValue.Buildings.First().Floors);
            Assert.Single(returnValue.Buildings.First().Floors.First().Areas);
        }

        [Fact]
        public async Task GetNiches_ReturnsNicheDtoList()
        {
            // Act
            var result = await _controller.GetNiches(1, 1, 1);

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<NicheDto>>>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<NicheDto>>(okResult.Value);
            var nicheList = returnValue.ToList();
            Assert.Single(nicheList);
            Assert.Equal(1, nicheList.First().NicheId);
            Assert.Equal("Niche 1", nicheList.First().NicheName);
            Assert.Equal("Status 1", nicheList.First().status);
        }
    }
}
