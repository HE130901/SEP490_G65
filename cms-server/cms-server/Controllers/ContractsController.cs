using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using cms_server.DTOs;

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

        // GET: api/Contracts/Customer/5
        [HttpGet("{customerId}/list")]
        public async Task<ActionResult<IEnumerable<ContractDto>>> GetContractsByCustomer(int customerId)
        {
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
                    CustomerName = c.Customer.FullName,
                    DeceasedName = c.Deceased != null ? c.Deceased.FullName : "Không có thông tin",
                    StartDate = c.StartDate,
                    Status = c.Status,
                    NicheName = $"{c.Niche.Area.Floor.Building.BuildingName} - {c.Niche.Area.Floor.FloorName} - {c.Niche.Area.AreaName} - Ô  {c.Niche.NicheName}"
                })
                .ToListAsync();

            if (contracts == null || !contracts.Any())
            {
                return NotFound();
            }

            return contracts;
        }

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
                NicheName = $"{contract.Niche.Area.Floor.Building.BuildingName} - {contract.Niche.Area.Floor.FloorName} - {contract.Niche.Area.AreaName} - {contract.Niche.NicheName}",
                DeceasedId = contract.DeceasedId,
                StartDate = contract.StartDate,
                EndDate = contract.EndDate,
                Status = contract.Status,
                Note = contract.Note,
                TotalAmount = contract.TotalAmount
            };

            return Ok(contractDetail);
        }
    }
}
