using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuildingsController : ControllerBase
    {
        private readonly CmsContext _context;

        public BuildingsController(CmsContext context)
        {
            _context = context;
        }



        [HttpGet("all")]
        public async Task<ActionResult<BuildingsFloorsAreasDto>> GetAllBuildingsFloorsAreas()
        {
            var buildings = await _context.Buildings
                .Include(b => b.Floors)
                    .ThenInclude(f => f.Areas)
                .ToListAsync();

            var dto = new BuildingsFloorsAreasDto
            {
                Buildings = buildings.Select(b => new BuildingDto
                {
                    BuildingId = b.BuildingId,
                    BuildingName = b.BuildingName,
                    BuildingDescription = b.BuildingDescription,
                    BuildingPicture = b.BuildingPicture,
                    Floors = b.Floors.Select(f => new FloorDto
                    {
                        FloorId = f.FloorId,
                        FloorName = f.FloorName,
                        Areas = f.Areas.Select(a => new AreaDto
                        {
                            AreaId = a.AreaId,
                            AreaName = a.AreaName
                        }).ToList()
                    }).ToList()
                }).ToList()
            };

            return dto;
        }

        [HttpGet("{buildingId}/floors/{floorId}/areas/{areaId}/niches")]
        public async Task<ActionResult<IEnumerable<Niche>>> GetNiches(int buildingId, int floorId, int areaId)
        {
            return await _context.Niches.Where(n => n.AreaId == areaId && n.Area.FloorId == floorId && n.Area.Floor.BuildingId == buildingId).ToListAsync();
        }
    }

    public class BuildingsFloorsAreasDto
    {
        public List<BuildingDto> Buildings { get; set; }
    }

    public class BuildingDto
    {
        public int BuildingId { get; set; }
        public string BuildingName { get; set; }
        public string BuildingDescription { get; set; }
        public string BuildingPicture { get; set; }
        public List<FloorDto> Floors { get; set; }
    }

    public class FloorDto
    {
        public int FloorId { get; set; }
        public string FloorName { get; set; }
        public List<AreaDto> Areas { get; set; }
    }

    public class AreaDto
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }
    }
}
