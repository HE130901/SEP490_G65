using cms_server.Controllers;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace cms_server.Tests
{
    public class ViewNicheListTests
    {
        private readonly DbContextOptions<CmsContext> _options;
        private readonly CmsContext _context;
        private readonly BuildingsController _controller;

        public ViewNicheListTests()
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

       
    }
}
