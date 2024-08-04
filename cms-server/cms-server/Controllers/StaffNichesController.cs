using cms_server.Configuration;
using cms_server.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffNichesController : ControllerBase
    {
        private readonly CmsContext _context;

        public StaffNichesController(CmsContext context)
        {
            _context = context;
        }

        // Get all niches within a specific area
        [HttpGet("area/{areaId}")]
        public async Task<ActionResult<IEnumerable<NicheDtoForStaff>>> GetNichesByArea(int areaId)
        {
            var niches = await _context.Niches
                .Where(n => n.AreaId == areaId)
                .Include(n => n.NicheHistories)
                .Select(n => new NicheDtoForStaff
                {
                    NicheId = n.NicheId,
                    NicheName = n.NicheName,
                    CustomerName = _context.Customers.FirstOrDefault(c => c.CustomerId == n.CustomerId).FullName,
                    DeceasedName = _context.Deceaseds.FirstOrDefault(d => d.DeceasedId == n.DeceasedId).FullName,
                    Description = n.NicheDescription,
                    NicheCode = n.NicheCode,
                    NicheHistories = n.NicheHistories.Select(h => new NicheHistoryDto
                    {
                        ContractId = h.ContractId.Value,
                        StartDate = h.StartDate,
                        EndDate = h.EndDate,
                        Status = h.Status
                    }).ToList(),
                    Status = n.Status
                })
                .ToListAsync();

            return Ok(niches);
        }

        [HttpGet("{nicheId}")]
        public async Task<ActionResult<NicheDtoForStaff>> GetNicheDetail(int nicheId)
        {
            var niche = await _context.Niches
                .Include(n => n.NicheHistories)
                .FirstOrDefaultAsync(n => n.NicheId == nicheId);

            if (niche == null)
            {
                return NotFound();
            }

            var nicheDto = new NicheDtoForStaff
            {
                NicheId = niche.NicheId,
                NicheName = niche.NicheName,
                CustomerName = _context.Customers.FirstOrDefault(c => c.CustomerId == niche.CustomerId)?.FullName,
                DeceasedName = _context.Deceaseds.FirstOrDefault(d => d.DeceasedId == niche.DeceasedId)?.FullName,
                Description = niche.NicheDescription,
                NicheCode = niche.NicheCode,
                NicheHistories = niche.NicheHistories.Select(h => new NicheHistoryDto
                {
                    ContractId = h.ContractId.Value,
                    ContractCode = _context.Contracts.FirstOrDefault(c => c.ContractId == h.ContractId).ContractCode,
                    StartDate = h.StartDate,
                    EndDate = h.EndDate,
                    Status = h.Status
                }).ToList(),
                Status = niche.Status
            };

            return Ok(nicheDto);
        }

        [HttpPut("{nicheId}")]
        public async Task<IActionResult> UpdateNiche(int nicheId, UpdateNicheDto updateNicheDto)
        {
            var niche = await _context.Niches.FindAsync(nicheId);

            if (niche == null)
            {
                return NotFound();
            }

            niche.NicheDescription = updateNicheDto.NicheDescription;
            niche.Status = updateNicheDto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NicheExists(nicheId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool NicheExists(int id)
        {
            return _context.Niches.Any(e => e.NicheId == id);
        }
    }

    public class NicheDtoForStaff
    {
        public int NicheId { get; set; }
        public string NicheName { get; set; }
        public string? CustomerName { get; set; }
        public string? NicheCode { get; set; }

        public string? DeceasedName { get; set; }
        public List<NicheHistoryDto> NicheHistories { get; set; } = new List<NicheHistoryDto>();
        public string? Status { get; set; }
        public string? Description { get; set; }

    }

    public class NicheHistoryDto
    {
        public int ContractId { get; set; }
        public string ContractCode { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Status { get; set; }
    }
    public class UpdateNicheDto
    {
        public string? NicheDescription { get; set; }
        public string Status { get; set; }
    }
}

