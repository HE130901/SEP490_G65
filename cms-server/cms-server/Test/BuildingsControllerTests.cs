using NUnit.Framework;
using Moq;
using Moq.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Controllers;
using cms_server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server_tests
{
    [TestFixture]
    public class BuildingsControllerTests
    {
        private Mock<CmsContext> _mockContext;
        private BuildingsController _controller;

        [SetUp]
        public void Setup()
        {
            _mockContext = new Mock<CmsContext>();
            _controller = new BuildingsController(_mockContext.Object);
        }

        [Test]
        public async Task GetAllBuildingsFloorsAreas_ReturnsBuildingsFloorsAreasDto()
        {
            // Arrange
            var buildings = new List<Building>
            {
                new Building
                {
                    BuildingId = 1,
                    BuildingName = "Building1",
                    BuildingDescription = "Description1",
                    BuildingPicture = "Picture1",
                    Floors = new List<Floor>
                    {
                        new Floor
                        {
                            FloorId = 1,
                            FloorName = "Floor1",
                            Areas = new List<Area>
                            {
                                new Area
                                {
                                    AreaId = 1,
                                    AreaName = "Area1"
                                }
                            }
                        }
                    }
                }
            };

            _mockContext.Setup(c => c.Buildings).ReturnsDbSet(buildings);

            // Act
            var result = await _controller.GetAllBuildingsFloorsAreas();

            // Assert
            Assert.That(result, Is.InstanceOf<ActionResult<BuildingsFloorsAreasDto>>());
            var dto = result.Value;
            Assert.That(dto.Buildings.Count, Is.EqualTo(1));
            Assert.That(dto.Buildings[0].BuildingName, Is.EqualTo("Building1"));
            Assert.That(dto.Buildings[0].Floors[0].FloorName, Is.EqualTo("Floor1"));
            Assert.That(dto.Buildings[0].Floors[0].Areas[0].AreaName, Is.EqualTo("Area1"));
        }

        [Test]
        public async Task GetNiches_ReturnsNiches()
        {
            // Arrange
            var area = new Area
            {
                AreaId = 1,
                FloorId = 1,
                Floor = new Floor
                {
                    FloorId = 1,
                    BuildingId = 1,
                    Building = new Building
                    {
                        BuildingId = 1
                    }
                }
            };

            var niches = new List<Niche>
            {
                new Niche
                {
                    NicheId = 1,
                    AreaId = 1,
                    Area = area
                }
            };

            _mockContext.Setup(c => c.Niches).ReturnsDbSet(niches);

            // Act
            var result = await _controller.GetNiches(1, 1, 1);

            // Assert
            Assert.That(result, Is.InstanceOf<ActionResult<IEnumerable<Niche>>>());
            var nichesList = result.Value.ToList();
            Assert.That(nichesList.Count, Is.EqualTo(1));
            Assert.That(nichesList[0].NicheId, Is.EqualTo(1));
        }
    }
}
