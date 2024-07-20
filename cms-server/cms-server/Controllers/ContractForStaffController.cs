using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using cms_server.DTOs;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractForStaffController : ControllerBase
    {
        private readonly CmsContext _context;

        public ContractForStaffController(CmsContext context)
        {
            _context = context;
        }

        private async Task<bool> IsDuplicateDeathCertificateNumberAsync(string deathCertificateNumber)
        {
            return await _context.Deceaseds.AnyAsync(d => d.DeathCertificateNumber == deathCertificateNumber);
        }

        [HttpPost("create-contract")]
        public async Task<IActionResult> CreateContract(CreateContractRequest request)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var niche = await _context.Niches
                        .FirstOrDefaultAsync(n => n.NicheId == request.NicheID && n.Status == "Available");

                    if (niche == null)
                    {
                        return BadRequest("Selected niche is not available.");
                    }

                    var customer = await _context.Customers
                        .FirstOrDefaultAsync(c => c.CitizenId == request.CustomerCitizenId);

                    if (customer == null)
                    {
                        // Create and add new customer
                        customer = new Customer
                        {
                            FullName = request.CustomerFullName,
                            Phone = request.CustomerPhoneNumber,
                            Email = request.CustomerEmail,
                            Address = request.CustomerAddress,
                            CitizenId = request.CustomerCitizenId,
                            CitizenIdissuanceDate = request.CustomerCitizenIdIssueDate,
                            CitizenIdsupplier = request.CustomerCitizenIdSupplier,
                            // Default password is "abcdabcd"
                            PasswordHash = "$2a$11$nUOFWiAMFi4zIAbIkYAbcuhFx3JYvT4ELKpBE6kh7IN5S9/wsfk4q"
                        };
                        _context.Customers.Add(customer);
                        await _context.SaveChangesAsync();
                    }

                    bool isDuplicateDeathCertificate = await IsDuplicateDeathCertificateNumberAsync(request.DeathCertificateNumber);
                    if (isDuplicateDeathCertificate)
                    {
                        return BadRequest("Đã có người mất đăng ký với số giấy chứng tử này!");
                    }

                    var deceased = new Deceased
                    {
                        FullName = request.DeceasedFullName,
                        DateOfBirth = request.DeceasedDateOfBirth,
                        DateOfDeath = request.DeceasedDateOfDeath,
                        NicheId = niche.NicheId,
                        CustomerId = customer.CustomerId,
                        DeathCertificateNumber = request.DeathCertificateNumber,
                        DeathCertificateSupplier = request.DeathCertificateSupplier,
                        CitizenId = request.DeceasedCitizenId,
                        RelationshipWithCusomer = request.RelationshipWithCustomer
                    };
                    _context.Deceaseds.Add(deceased);
                    await _context.SaveChangesAsync();

                    var contract = new Contract
                    {
                        CustomerId = customer.CustomerId,
                        StaffId = request.StaffID,
                        NicheId = niche.NicheId,
                        DeceasedId = deceased.DeceasedId,
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Status = "Active",
                        Note = request.Note,
                        TotalAmount = request.TotalAmount
                    };
                    _context.Contracts.Add(contract);
                    await _context.SaveChangesAsync();

                    niche.Status = "Unavailable";
                    niche.CustomerId = customer.CustomerId;
                    niche.DeceasedId = deceased.DeceasedId;
                    _context.Niches.Update(niche);
                    await _context.SaveChangesAsync();

                    var nicheHistory = new NicheHistory
                    {
                        NicheId = niche.NicheId,
                        CustomerId = customer.CustomerId,
                        DeceasedId = deceased.DeceasedId,
                        ContractId = contract.ContractId,
                        StartDate = contract.StartDate,
                        EndDate = contract.EndDate
                    };
                    _context.NicheHistories.Add(nicheHistory);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Ok(contract);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    // Log the error (consider using a logging framework like Serilog)
                    var innerExceptionMessage = ex.InnerException?.Message;
                    var detailedErrorMessage = $"Error: {ex.Message}, Inner Exception: {innerExceptionMessage}";
                    return StatusCode(500, detailedErrorMessage);
                }
            }
        }

        // New method to get all contracts
        [HttpGet("all-contracts")]
        public async Task<IActionResult> GetAllContracts()
        {
            var contracts = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Niche)

                .Select(c => new ContractForStaffDto
                {
                    ContractId = c.ContractId,
                    NicheId = c.NicheId,
                    CustomerId = c.CustomerId,
                    NicheAddress = $"{c.Niche.Area.Floor.Building.BuildingName}-{c.Niche.Area.Floor.FloorName}-{c.Niche.Area.AreaName}-Ô {c.Niche.NicheName}",
                    CustomerName = c.Customer.FullName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status
                })
                .ToListAsync();
            return Ok(contracts);
        }

        // New method to get details of a specific contract by ID
        [HttpGet("contract/{id}")]
        public async Task<IActionResult> GetContractById(int id)
        {
            var contract = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Niche)
                .Select(c => new ContractForStaffDto
                {
                    ContractId = c.ContractId,
                    NicheAddress = $"{c.Niche.Area.Floor.Building.BuildingName}-{c.Niche.Area.Floor.FloorName}-{c.Niche.Area.AreaName}-{c.Niche.NicheName}",
                    CustomerName = c.Customer.FullName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status
                })
                .FirstOrDefaultAsync(c => c.ContractId == id);

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }

        // New methods to fetch buildings, floors, zones, and niches

        // GET: api/Contracts/buildings
        [HttpGet("buildings")]
        public async Task<ActionResult<IEnumerable<BuildingDto>>> GetBuildings()
        {
            var buildings = await _context.Buildings
                .Select(b => new BuildingDto
                {
                    BuildingId = b.BuildingId,
                    BuildingName = b.BuildingName
                })
                .ToListAsync();

            return Ok(buildings);
        }

        // GET: api/Contracts/buildings/{buildingId}/floors
        [HttpGet("buildings/{buildingId}/floors")]
        public async Task<ActionResult<IEnumerable<FloorDto>>> GetFloors(int buildingId)
        {
            var floors = await _context.Floors
                .Where(f => f.BuildingId == buildingId)
                .Select(f => new FloorDto
                {
                    FloorId = f.FloorId,
                    FloorName = f.FloorName
                })
                .ToListAsync();

            return Ok(floors);
        }

        // GET: api/Contracts/buildings/{buildingId}/floors/{floorId}/areas
        [HttpGet("buildings/{buildingId}/floors/{floorId}/areas")]
        public async Task<ActionResult<IEnumerable<AreaDto>>> GetZones(int buildingId, int floorId)
        {
            var areas = await _context.Areas
                .Where(a => a.FloorId == floorId)
                .Select(a => new AreaDto
                {
                    AreaId = a.AreaId,
                    AreaName = a.AreaName
                })
                .ToListAsync();

            return Ok(areas);
        }

        // GET: api/Contracts/buildings/{buildingId}/floors/{floorId}/areas/{zoneId}/niches
        [HttpGet("buildings/{buildingId}/floors/{floorId}/areas/{areaID}/niches")]
        public async Task<ActionResult<IEnumerable<NicheDto>>> GetNiches(int buildingId, int floorId, int areaId)
        {
            var niches = await _context.Niches
                .Where(n => n.AreaId == areaId)
                .Select(n => new NicheDto
                {
                    NicheId = n.NicheId,
                    NicheName = n.NicheName
                })
                .ToListAsync();

            return Ok(niches);
        }
    }

    public class CreateContractRequest
    {
        public string CustomerFullName { get; set; }
        public string? CustomerPhoneNumber { get; set; }
        public string CustomerEmail { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerCitizenId { get; set; }
        public DateOnly? CustomerCitizenIdIssueDate { get; set; }
        public string? CustomerCitizenIdSupplier { get; set; }
        public string DeceasedFullName { get; set; }
        public string? DeceasedCitizenId { get; set; }
        public DateOnly? DeceasedDateOfBirth { get; set; }
        public DateOnly? DeceasedDateOfDeath { get; set; }
        public string? DeathCertificateNumber { get; set; }
        public string? DeathCertificateSupplier { get; set; }
        public string? RelationshipWithCustomer { get; set; }
        public int? NicheID { get; set; }
        public int StaffID { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Note { get; set; }
        public decimal TotalAmount { get; set; }
    }


public class ContractForStaffDto
    {
        public int ContractId { get; set; }
        public int NicheId { get; set; }
        public int CustomerId { get; set; }
        public string NicheAddress { get; set; }
        public string CustomerName { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string Status { get; set; }
        
    }
}
