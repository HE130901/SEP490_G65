using cms_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet("buildings")]
        public async Task<IActionResult> GetBuildings()
        {
            var buildings = await _context.Buildings.ToListAsync();
            return Ok(buildings);
        }

        [HttpGet("buildings/{buildingId}/floors")]
        public async Task<IActionResult> GetFloors(int buildingId)
        {
            var floors = await _context.Floors
                .Where(f => f.BuildingId == buildingId)
                .ToListAsync();
            return Ok(floors);
        }

        [HttpGet("floors/{floorId}/areas")]
        public async Task<IActionResult> GetAreas(int floorId)
        {
            var areas = await _context.Areas
                .Where(a => a.FloorId == floorId)
                .ToListAsync();
            return Ok(areas);
        }

        [HttpGet("areas/{areaId}/niches")]
        public async Task<IActionResult> GetNiches(int areaId)
        {
            var niches = await _context.Niches
                .Where(n => n.AreaId == areaId && n.Status == "Available")
                .ToListAsync();
            return Ok(niches);
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

                    var customer = new Customer
                    {
                        FullName = request.CustomerFullName,
                        Phone = request.CustomerPhoneNumber,
                        Email = request.CustomerEmail,
                        Address = request.CustomerAddress,
                        CitizenId = request.CustomerCitizenId,
                        CitizenIdissuanceDate = request.CustomerCitizenIdIssueDate,
                        CitizenIdsupplier = request.CustomerCitizenIdSupplier,
                        PasswordHash = "$2a$11$nUOFWiAMFi4zIAbIkYAbcuhFx3JYvT4ELKpBE6kh7IN5S9/wsfk4q"

                    };
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();

                    var deceased = new Deceased
                    {
                        FullName = request.DeceasedFullName,
                        DateOfBirth = request.DeceasedDateOfBirth,
                        DateOfDeath = request.DeceasedDateOfDeath,
                        NicheId = niche.NicheId,
                        CustomerId = customer.CustomerId,
                        DeathCertificateNumber = request.DeathCertificateNumber,
                        DeathCertificateSupplier = request.DeathCertificateSupplier,
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
}
