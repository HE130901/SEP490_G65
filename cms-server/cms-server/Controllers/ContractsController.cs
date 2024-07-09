using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using cms_server.DTOs;
using cms_server.Services;

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

        // GET: api/Contracts/5/list
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
                    ContractId = c.ContractId,
                    NicheName = $"{c.Niche.Area.Floor.Building.BuildingName} - {c.Niche.Area.Floor.FloorName} - {c.Niche.Area.AreaName} - Ô {c.Niche.NicheName}",
                    CustomerName = c.Customer.FullName,
                    DeceasedName = c.Deceased != null ? c.Deceased.FullName : "Không có thông tin",
                    DeceasedRelationshipWithCustomer =  c.Deceased.RelationshipWithCusomer,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status
                })
                .ToListAsync();

            if (contracts == null || !contracts.Any())
            {
                return NotFound();
            }

            return contracts;
        }

        // GET: api/Contracts/1/detail
        [HttpGet("{contractId}/detail")]
        public async Task<ActionResult<ContractDetailDto>> GetContractDetail(int contractId)
        {
            // Tạo mới bản ghi trong bảng Deceased
            var deceased = new Deceased
            {
                CustomerId = contractDto.CustomerId,
                NicheId = contractDto.NicheId,
                CitizenId = contractDto.CitizenId,
                FullName = contractDto.FullName,
                DateOfBirth = contractDto.DateOfBirth,
                DateOfDeath = contractDto.DateOfDeath
            };

            _context.Deceaseds.Add(deceased);
            await _context.SaveChangesAsync();

            // Tạo mới bản ghi trong bảng Contract
            var contract = new Contract
            {
                CustomerId = contractDto.CustomerId,
                StaffId = contractDto.StaffId,
                NicheId = contractDto.NicheId,
                DeceasedId = deceased.DeceasedId,
                StartDate = contractDto.StartDate,
                EndDate = contractDto.EndDate,
                TotalAmount = contractDto.TotalAmount,
                Status = "Active", 
                Note = contractDto.Note,
            };

            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            // Tạo mới bản ghi trong bảng NicheHistory
            var nicheHistory = new NicheHistory
            {
                CustomerId = contractDto.CustomerId,
                NicheId = contractDto.NicheId,
                DeceasedId = deceased.DeceasedId,
                ContractId = contract.ContractId,
                StartDate = contractDto.StartDate,
                EndDate = contractDto.EndDate
            };

            _context.NicheHistories.Add(nicheHistory);
            await _context.SaveChangesAsync();

            // Sửa đổi trạng thái của Niche thành unavailable
            var niche = await _context.Niches.FindAsync(contractDto.NicheId);
            if (niche != null)
            {
                niche.Status = "unavailable";
                _context.Entry(niche).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction("GetContract", new { id = contract.ContractId }, contract);
        }


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
                TotalAmount = contract.TotalAmount
            };

            return Ok(contractDetail);
        }
    }
}
