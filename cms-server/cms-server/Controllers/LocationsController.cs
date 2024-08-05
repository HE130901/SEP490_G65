using Microsoft.AspNetCore.Mvc;
using cms_server.Models;
using cms_server.Services;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationsController(ILocationService locationService)
        {
            _locationService = locationService;
        }
[HttpGet("buildings")]
        public async Task<ActionResult<IEnumerable<Building>>> GetBuildings()
        {
            var buildings = await _locationService.GetBuildingsAsync();
            return Ok(buildings);
        }
[HttpGet("floors/{buildingId}")]
        public async Task<ActionResult<IEnumerable<Floor>>> GetFloorsByBuildingId(int buildingId)
        {
            var floors = await _locationService.GetFloorsByBuildingIdAsync(buildingId);
            return Ok(floors);
        }