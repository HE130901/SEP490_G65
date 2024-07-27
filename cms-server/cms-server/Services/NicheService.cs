using cms_server.DTOs;
using cms_server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Services
{
    public interface INicheService
    {
        Task<IEnumerable<NicheDto>> GetNichesAsync(int customerId);
        Task<NicheDetailDto> GetNicheDetailAsync(int nicheId);
        Task<NicheDetailDto3> GetNicheDetailAsync3(int nicheId);
    }

    public class NicheService : INicheService
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
                    NicheAddress = $"{n.Area.Floor.Building.BuildingName} - {n.Area.Floor.FloorName} - {n.Area.AreaName} - Ô {n.NicheName}",
                    ContractStatus = n.Contracts
                        .OrderByDescending(c => c.StartDate)
                        .Select(c => c.Status)
                        .FirstOrDefault() ?? "Không xác định",
                    ContractId = n.Contracts
                        .OrderByDescending(c => c.StartDate)
                        .Select(c => c.ContractId)
                        .FirstOrDefault(),
                    DeceasedName = n.Contracts
                        .OrderByDescending(c => c.StartDate)
                        .Select(c => c.Deceased.FullName)
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
                NicheId = niche.NicheId,
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
        public async Task<NicheDetailDto3> GetNicheDetailAsync3(int nicheId)
        {
            var niche = await _context.Niches
                .Include(n => n.Area)
                    .ThenInclude(a => a.Floor)
                        .ThenInclude(f => f.Building)
                .Include(n => n.Contracts)
                    .ThenInclude(c => c.Deceased)
                .Include(n => n.VisitRegistrations)
                .Include(n => n.ServiceOrders)
                    .ThenInclude(so => so.ServiceOrderDetails)
                    .ThenInclude(sod => sod.Service)
                .FirstOrDefaultAsync(n => n.NicheId == nicheId);

            if (niche == null)
            {
                throw new KeyNotFoundException("Niche not found");
            }

            var contract = niche.Contracts.OrderByDescending(c => c.StartDate).FirstOrDefault();
            if (contract == null)
            {
                throw new KeyNotFoundException("No contract found for this niche");
            }

            var nicheDetailDto3 = new NicheDetailDto3
            {
                NicheId = niche.NicheId,
                ContractId = contract.ContractId,
                NicheAddress = $"{niche.Area.Floor.Building.BuildingName} - {niche.Area.Floor.FloorName} - {niche.Area.AreaName} - Ô {niche.NicheName}",
                FullName = contract.Deceased?.FullName ?? "N/A",
                StartDate = contract.StartDate,
                EndDate = contract.EndDate,
                Status = contract.Status,
                NicheDescription = niche.NicheDescription,
                VisitRegistrations = niche.VisitRegistrations.Select(vr => new VisitRegistrationDto3
                {
                    VisitId = vr.VisitId,
                    VisitDate = vr.VisitDate,
                    Status = vr.Status,
                    Note = vr.Note,
                    AccompanyingPeople = vr.AccompanyingPeople
                }).ToList(),
                ServiceOrders = niche.ServiceOrders.Select(so => new ServiceOrderDto3
                {
                    ServiceOrderId = so.ServiceOrderId,
                    OrderDate = so.OrderDate,
                    ServiceOrderDetails = so.ServiceOrderDetails.Select(sod => new ServiceOrderDetailDto3
                    {
                        ServiceName = sod.Service.ServiceName,
                        Quantity = sod.Quantity,
                        CompletionImage = sod.CompletionImage,
                        Status = sod.Status
                    }).ToList()
                }).ToList()
            };

            return nicheDetailDto3;
        }

    }
}
