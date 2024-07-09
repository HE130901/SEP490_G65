using cms_server.DTOs;
using cms_server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Services
{
    public class NicheService
    {
        private readonly CmsContext _context;

        public NicheService(CmsContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NicheDto>> GetNichesAsync(int customerId)
        {
            return await _context.Niches
                .Where(n => n.CustomerId == customerId)
                .Select(n => new NicheDto
                {
                    NicheId = n.NicheId,
                    NicheName = n.NicheName,
                    ContractStatus = n.Contracts
                        .OrderByDescending(c => c.StartDate)
                        .Select(c => c.Status)
                        .FirstOrDefault() ?? "Không xác định",
                    ContractId = n.Contracts
                        .OrderByDescending(c => c.StartDate)
                        .Select(c => c.ContractId)
                        .FirstOrDefault(),
                    DeceasedName = n.Deceaseds
                        .OrderByDescending(d => d.DateOfDeath)
                        .Select(d => d.FullName)
                        .FirstOrDefault() ?? "Không có thông tin"
                })
                .ToListAsync();
        }

        public async Task<NicheDetailDto> GetNicheDetailAsync(int nicheId)
        {
            var niche = await _context.Niches
                .Include(n => n.Area)
                    .ThenInclude(a => a.Floor)
                        .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(n => n.NicheId == nicheId);

            if (niche == null)
            {
                throw new KeyNotFoundException("Niche not found.");
            }

            return new NicheDetailDto
            {
                BuildingName = niche.Area.Floor.Building.BuildingName,
                BuildingDescription = niche.Area.Floor.Building.BuildingDescription,
                BuildingPicture = niche.Area.Floor.Building.BuildingPicture,
                FloorName = niche.Area.Floor.FloorName,
                FloorDescription = niche.Area.Floor.FloorDescription,
                FloorPicture = niche.Area.Floor.FloorPicture,
                NichePrice = niche.Area.Floor.NichePrice,
                AreaName = niche.Area.AreaName,
                AreaDescription = niche.Area.AreaDescription,
                AreaPicture = niche.Area.AreaPicture,
                NicheName = niche.NicheName,
                NicheDescription = niche.NicheDescription
            };
        }
  
    }
}
