using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using cms_server.Controllers;
using cms_server.Models;

public class BuildingsControllerTests
{
    private DbContextOptions<CmsContext> CreateNewContextOptions()
    {
        return new DbContextOptionsBuilder<CmsContext>()
            .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
            .Options;
    }

    private CmsContext CreateContext()
    {
        var options = CreateNewContextOptions();
        var context = new CmsContext(options);

        // Initialize data
        context.Buildings.Add(new Building
        {
            BuildingId = 1,
            BuildingName = "Test Building",
            BuildingDescription = "Description",
            BuildingPicture = "Picture",
            Floors = new List<Floor>
            {
                new Floor
                {
                    FloorId = 1,
                    FloorName = "Test Floor",
                    Areas = new List<Area>
                    {
                        new Area
                        {
                            AreaId = 1,
                            AreaName = "Test Area"
                        }
                    }
                }
            }
        });

        context.SaveChanges();
        return context;
    }

    [Fact]
    public async Task GetAllBuildingsFloorsAreas_ReturnsCorrectStructure()
    {
        using (var context = CreateContext())
        {
            var controller = new BuildingsController(context);

            // Act
            var result = await controller.GetAllBuildingsFloorsAreas();

            // Assert
            var dto = Assert.IsType<ActionResult<BuildingsFloorsAreasDto>>(result).Value;
            Assert.Single(dto.Buildings);
            var buildingDto = dto.Buildings.First();
            Assert.Equal("Test Building", buildingDto.BuildingName);
            Assert.Single(buildingDto.Floors);
            var floorDto = buildingDto.Floors.First();
            Assert.Equal("Test Floor", floorDto.FloorName);
            Assert.Single(floorDto.Areas);
            var areaDto = floorDto.Areas.First();
            Assert.Equal("Test Area", areaDto.AreaName);
        }
    }
}
