using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;

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

        // GET: api/Contracts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contract>>> GetContracts()
        {
            return await _context.Contracts.ToListAsync();
        }

        // GET: api/Contracts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContract(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);

            if (contract == null)
            {
                return NotFound();
            }

            return contract;
        }

        // PUT: api/Contracts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContract(int id, Contract contract)
        {
            if (id != contract.ContractId)
            {
                return BadRequest();
            }

            _context.Entry(contract).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContractExists(id))
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

        // POST: api/Contracts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Contract>> PostContract(ContractDto contractDto)
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
                ServicePriceList = contractDto.ServicePriceList,
                TotalAmount = contractDto.TotalAmount,
                Status = "Active"
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

        // DELETE: api/Contracts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContract(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }

            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContractExists(int id)
        {
            return _context.Contracts.Any(e => e.ContractId == id);
        }

        // GET: api/Contracts/Customer/5
        [HttpGet("Customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Contract>>> GetContractsByCustomer(int customerId)
        {
            var contracts = await _context.Contracts
                .Where(c => c.CustomerId == customerId)
                .ToListAsync();

            if (contracts == null || !contracts.Any())
            {
                return NotFound();
            }

            return contracts;
        }
    }

    public class ContractDto
    {
        public int CustomerId { get; set; }
        public int StaffId { get; set; }
        public int NicheId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? ServicePriceList { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? CitizenId { get; set; }
        public string FullName { get; set; } = null!;
        public DateOnly? DateOfBirth { get; set; }
        public DateOnly? DateOfDeath { get; set; }
    }
}
