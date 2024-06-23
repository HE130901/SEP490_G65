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
                    NicheDescription = n.NicheDescription,
                    // Retrieve the latest contract status
                    ContractStatus = n.Contracts
                        .OrderByDescending(c => c.StartDate)
                        .Select(c => c.Status)
                        .FirstOrDefault() ?? "Không xác định"
                })
                .ToListAsync();
        }

        public async Task<NicheDetailDto> GetNicheDetailAsync(int nicheId)
        {
            var niche = await _context.Niches
                .Include(n => n.Area)
                    .ThenInclude(a => a.Floor)
                        .ThenInclude(f => f.Building)
                .Include(n => n.Deceaseds)
                .Include(n => n.Contracts)
                    .ThenInclude(c => c.Customer)
                .FirstOrDefaultAsync(n => n.NicheId == nicheId);

            if (niche == null)
            {
                throw new KeyNotFoundException("Niche not found.");
            }

            var latestContract = niche.Contracts.OrderByDescending(c => c.StartDate).FirstOrDefault();
            var deceased = niche.Deceaseds.FirstOrDefault();
            var customer = latestContract?.Customer;

            return new NicheDetailDto
            {
                NicheAddress = $"{niche.Area.Floor.Building.BuildingName} - {niche.Area.Floor.FloorName} - {niche.Area.AreaName} - Ô {niche.NicheName}",
                NicheDescription = niche.NicheDescription,
                CustomerName = customer?.FullName,
                DeceasedName = deceased?.FullName,
                StartDate = latestContract?.StartDate,
                EndDate = latestContract?.EndDate,
                ContractStatus = latestContract?.Status ?? "Không xác định"
            };
        }
    }
}
