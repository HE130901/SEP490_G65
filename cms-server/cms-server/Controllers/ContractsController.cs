using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using cms_server.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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


        // POST: api/Contracts/renew
        [HttpPost("renew")]
        public async Task<ActionResult> RenewContract(ContractRenewalRequestDto renewalRequest)
        {
            if (renewalRequest == null)
            {
                return BadRequest("Renewal request cannot be null.");
            }

            // Get customer ID from the logged-in user
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int customerId;
            if (!int.TryParse(userIdClaim.Value, out customerId))
            {
                return Unauthorized("Invalid user ID in token.");
            }

            var contract = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Niche)
                .FirstOrDefaultAsync(c => c.ContractId == renewalRequest.ContractId && c.CustomerId == customerId);

            if (contract == null)
            {
                return NotFound("Contract not found.");
            }

            if (contract.Customer == null || contract.Niche == null)
            {
                return BadRequest("Invalid contract data.");
            }

            // Update contract status to PendingRenewal
            contract.Status = "PendingRenewal";
            _context.Entry(contract).State = EntityState.Modified;

            // Create a new NicheReservation for the renewal
            var nicheReservation = new NicheReservation
            {
                NicheId = contract.NicheId,
                CreatedDate = DateTime.Now,
                ConfirmationDate = renewalRequest.ConfirmationDate,
                Status = "PendingContractRenewal",
                Note = renewalRequest.Note,
                Name = contract.Customer.FullName,
                PhoneNumber = contract.Customer.Phone,
                SignAddress = renewalRequest.SignAddress
            };

            _context.NicheReservations.Add(nicheReservation);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContractExists(renewalRequest.ContractId))
                {
                    return NotFound("Contract not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Contracts/cancel
        [HttpPost("cancel")]
        [Authorize]
        public async Task<ActionResult> CancelContract(ContractCancellationRequestDto cancellationRequest)
        {
            if (cancellationRequest == null)
            {
                return BadRequest("Cancellation request cannot be null.");
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int customerId = int.Parse(userIdClaim.Value);

            var contract = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Niche)
                .FirstOrDefaultAsync(c => c.ContractId == cancellationRequest.ContractId && c.CustomerId == customerId);

            if (contract == null)
            {
                return NotFound("Contract not found.");
            }

            if (contract.Customer == null || contract.Niche == null)
            {
                return BadRequest("Invalid contract data.");
            }

            // Update contract status to PendingCancellation
            contract.Status = "PendingCancellation";
            _context.Entry(contract).State = EntityState.Modified;

            // Create a new NicheReservation for the cancellation
            var nicheReservation = new NicheReservation
            {
                NicheId = contract.NicheId,
                CreatedDate = DateTime.Now,
                ConfirmationDate = cancellationRequest.ConfirmationDate,
                Status = "PendingContractCancellation",
                Note = cancellationRequest.Note,
                Name = contract.Customer.FullName,
                PhoneNumber = contract.Customer.Phone,
                SignAddress = cancellationRequest.SignAddress
            };

            _context.NicheReservations.Add(nicheReservation);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContractExists(cancellationRequest.ContractId))
                {
                    return NotFound("Contract not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        private bool ContractExists(int id)
        {
            return _context.Contracts.Any(e => e.ContractId == id);
        }

    }
    public class ContractRenewalRequestDto
    {
        public int ContractId { get; set; }
        public string? Note { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string? SignAddress { get; set; }
    }
    public class ContractCancellationRequestDto
    {
        public int ContractId { get; set; }
        public string Note { get; set; }
        public DateTime ConfirmationDate { get; set; }
        public string SignAddress { get; set; }
    }

}
