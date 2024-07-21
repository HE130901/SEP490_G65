using cms_server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace cms_server.Services
{
    public interface ILocationService
    {
        Task<IEnumerable<Building>> GetBuildingsAsync();
        Task<IEnumerable<Floor>> GetFloorsByBuildingIdAsync(int buildingId);
        Task<IEnumerable<Area>> GetAreasByFloorIdAsync(int floorId);
        Task<IEnumerable<Niche>> GetNichesByAreaIdAsync(int areaId);
    }
}
