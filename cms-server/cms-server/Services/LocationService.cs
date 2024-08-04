using cms_server.Configuration;
using cms_server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace cms_server.Services
{
    public class LocationService : ILocationService
    {
        private readonly CmsContext _context;

        public LocationService(CmsContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Building>> GetBuildingsAsync()
        {
            return await _context.Buildings.ToListAsync();
        }

        public async Task<IEnumerable<Floor>> GetFloorsByBuildingIdAsync(int buildingId)
        {
            return await _context.Floors.Where(f => f.BuildingId == buildingId).ToListAsync();
        }

        public async Task<IEnumerable<Area>> GetAreasByFloorIdAsync(int floorId)
        {
            return await _context.Areas.Where(a => a.FloorId == floorId).ToListAsync();
        }

        public async Task<IEnumerable<Niche>> GetNichesByAreaIdAsync(int areaId)
        {
            return await _context.Niches.Where(n => n.AreaId == areaId).ToListAsync();
        }
    }
}
