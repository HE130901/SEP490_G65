using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using cms_server.Configuration;

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

        // GET: /api/buildings/all
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

        // GET: /api/buildings/1/floors/1/areas/1/nichesForCustomer
        [Authorize]
        [HttpGet("{buildingId}/floors/{floorId}/areas/{areaId}/nichesForCustomer")]
        public async Task<ActionResult<IEnumerable<NicheDto1>>> GetNichesForCustomer(int buildingId, int floorId, int areaId)
        {
            // Get the user ID from the token
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Get the niches in the area
            var niches = await _context.Niches
                .Where(n => n.AreaId == areaId && n.Area.FloorId == floorId && n.Area.Floor.BuildingId == buildingId)
                .Select(n => new NicheDto1
                {
                    NicheId = n.NicheId,
                    NicheName = n.NicheName,
                    Status = n.Status,
                    ReservedByUser = n.CustomerId == userId 
                })
                .ToListAsync();

            return niches;
        }

        // GET: /api/buildings/1/floors/1/areas/1/niches
        [HttpGet("{buildingId}/floors/{floorId}/areas/{areaId}/niches")]
        public async Task<ActionResult<IEnumerable<NicheDto2>>> GetNiches(int buildingId, int floorId, int areaId)
        {

            // Get the niches in the area
            var niches = await _context.Niches
                .Where(n => n.AreaId == areaId && n.Area.FloorId == floorId && n.Area.Floor.BuildingId == buildingId)
                .Select(n => new NicheDto2
                {
                    NicheId = n.NicheId,
                    NicheName = n.NicheName,
                    Status = n.Status,
                })
                .ToListAsync();

            return niches;
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


}