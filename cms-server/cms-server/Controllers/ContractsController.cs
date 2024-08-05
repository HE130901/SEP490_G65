using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractsController : ControllerBase
    {
        private readonly CmsContext _context;

        public ContractsController(CmsContext context)
        {
            _context = context;
        }

	// GET: api/{customerId}/list
        [HttpGet("{customerId}/list")]
        public async Task<ActionResult<IEnumerable<ContractDto>>> GetContractsByCustomer(int customerId)
        {
            // Get contracts for the specified customer
            var contracts = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Niche)
                    .ThenInclude(n => n.Area)
                        .ThenInclude(a => a.Floor)
                            .ThenInclude(f => f.Building)
                .Where(c => c.CustomerId == customerId)
                .Select(c => new ContractDto
                {
                    NicheId = c.NicheId,
                    ContractId = c.ContractId,
                    ContractCode = c.ContractCode,
                    CustomerName = c.Customer.FullName,
                    DeceasedName = c.Deceased != null ? c.Deceased.FullName : "Không có thông tin",
                    DeceasedRelationshipWithCustomer = c.Deceased != null ? c.Deceased.RelationshipWithCusomer : "Không có thông tin",
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status,
                    NicheName = $"{c.Niche.Area.Floor.Building.BuildingName} - {c.Niche.Area.Floor.FloorName} - {c.Niche.Area.AreaName} - Ô {c.Niche.NicheName}",
                    DaysLeft = (c.Status == "Expired" || c.Status == "Canceled" || !c.EndDate.HasValue)
                        ? 0
                        : Math.Max((c.EndDate.Value.ToDateTime(TimeOnly.MinValue) - DateTime.Now).Days, 0)
                })
                .ToListAsync();

            if (contracts == null || !contracts.Any())
            {
                return NotFound();
            }

            return contracts;
        }


    }
}