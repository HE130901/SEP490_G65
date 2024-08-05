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

    // GET: api/Contracts/{contractId}/detail
    [HttpGet("{contractId}/detail")]
        public async Task<ActionResult<ContractDto>> GetContractDetail(int contractId)
        {
            var contract = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Staff)
                .Include(c => c.Niche)
                    .ThenInclude(n => n.Area)
                        .ThenInclude(a => a.Floor)
                            .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(c => c.ContractId == contractId);

            if (contract == null)
            {
                return NotFound();
            }

            var contractDetail = new ContractDetailDto
            {
                CustomerName = contract.Customer.FullName,
                CustomerEmail = contract.Customer.Email,
                CustomerPhone = contract.Customer.Phone,
                CustomerCitizenID = contract.Customer.CitizenId,
                CustomerAddress = contract.Customer.Address,
                CitizenIdsupplier = contract.Customer.CitizenIdsupplier,
                CitizenIdissuanceDate = contract.Customer.CitizenIdissuanceDate,
                DeceasedName = contract.Deceased != null ? contract.Deceased.FullName : "Không có thông tin",
                DeceasedCitizenID = contract.Deceased?.CitizenId,
                DeceasedDateOfBirth = contract.Deceased?.DateOfBirth,
                DeceasedDateOfDeath = contract.Deceased?.DateOfDeath,
                DeceasedDeathCertificateNumber = contract.Deceased?.DeathCertificateNumber,
                DeceasedDeathCertificateSupplier = contract.Deceased?.DeathCertificateSupplier,
                DeceasedRelationshipWithCustomer = contract.Deceased?.RelationshipWithCusomer,
                ContractId = contract.ContractId,
                CustomerId = contract.CustomerId,
                StaffId = contract.StaffId,
                StaffName = contract.Staff.FullName,
                NicheId = contract.NicheId,
                NicheName = $"{contract.Niche.Area.Floor.Building.BuildingName} - {contract.Niche.Area.Floor.FloorName} - {contract.Niche.Area.AreaName} - Ô {contract.Niche.NicheName}",
                DeceasedId = contract.DeceasedId,
                StartDate = contract.StartDate,
                EndDate = contract.EndDate,
                Status = contract.Status,
                Note = contract.Note,
                TotalAmount = contract.TotalAmount,
                ContractCode = contract.ContractCode,
                NicheCode = contract.Niche.NicheCode,

            };

            return Ok(contractDetail);
        }



    }
}