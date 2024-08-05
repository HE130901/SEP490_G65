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


    }
}