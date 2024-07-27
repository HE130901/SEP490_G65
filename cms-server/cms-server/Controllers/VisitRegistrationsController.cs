using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using TimeZoneConverter;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitRegistrationsController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly ILogger<VisitRegistrationsController> _logger;
        private readonly string timeZoneId = TZConvert.WindowsToIana("SE Asia Standard Time");

        private DateTime ConvertToTimeZone(DateTime utcDateTime)
        {
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timeZoneInfo);
        }

        private DateTime ConvertToUtc(DateTime dateTime)
        {
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            return TimeZoneInfo.ConvertTimeToUtc(dateTime, timeZoneInfo);
        }
        public VisitRegistrationsController(CmsContext context, ILogger<VisitRegistrationsController> logger)
        {
            _context = context;
            _logger = logger;
        }


        // GET: api/VisitRegistrations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VisitRegistrationDto>>> GetVisitRegistrations()
        {
            try
            {
                var visitRegistrations = await _context.VisitRegistrations
                    .Include(vr => vr.Customer)
                    .Include(vr => vr.Niche)
                        .ThenInclude(n => n.Area)
                            .ThenInclude(a => a.Floor)
                                .ThenInclude(f => f.Building)
                    .Include(vr => vr.ApprovedByNavigation) // Include the Staff entity
                    .Select(vr => new VisitRegistrationDto
                    {
                        VisitId = vr.VisitId,
                        CustomerId = vr.CustomerId,
                        NicheId = vr.NicheId,
                        VisitDate = vr.VisitDate,
                        NicheAddress = $"{vr.Niche.Area.Floor.Building.BuildingName} - {vr.Niche.Area.Floor.FloorName} - {vr.Niche.Area.AreaName} - Ô {vr.Niche.NicheName}",
                        Status = vr.Status ?? "No information",
                        ApprovedBy = vr.ApprovedBy,
                        CreatedDate = vr.CreatedDate ?? DateTime.MinValue,
                        Note = vr.Note ?? string.Empty,
                        AccompanyingPeople = (int)vr.AccompanyingPeople,
                        CustomerName = vr.Customer.FullName,
                        StaffName = vr.ApprovedByNavigation != null ? vr.ApprovedByNavigation.FullName : "N/A",
                        VisitCode = vr.VisitCode,
                    })
                    .ToListAsync();

                return Ok(visitRegistrations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching visit registrations: {Message}", ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/VisitRegistrations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VisitRegistrationDto>> GetVisitRegistration(int id)
        {
            var visitRegistration = await _context.VisitRegistrations
                .Include(vr => vr.Customer)
                .Include(vr => vr.Niche)
                    .ThenInclude(n => n.Area)
                        .ThenInclude(a => a.Floor)
                            .ThenInclude(f => f.Building)
                .Include(vr => vr.ApprovedByNavigation) // Include the Staff entity
                .Where(vr => vr.VisitId == id)
                .Select(vr => new VisitRegistrationDto
                {
                    VisitId = vr.VisitId,
                    CustomerId = vr.CustomerId,
                    NicheId = vr.NicheId,
                    VisitDate = vr.VisitDate,
                    NicheAddress = $"{vr.Niche.Area.Floor.Building.BuildingName} - {vr.Niche.Area.Floor.FloorName} - {vr.Niche.Area.AreaName} - Ô {vr.Niche.NicheName}",
                    Status = vr.Status ?? "No information",
                    ApprovedBy = vr.ApprovedBy,
                    CreatedDate = vr.CreatedDate ?? DateTime.MinValue,
                    Note = vr.Note ?? string.Empty,
                    AccompanyingPeople = (int)vr.AccompanyingPeople,
                    CustomerName = vr.Customer.FullName,
                    StaffName = vr.ApprovedByNavigation != null ? vr.ApprovedByNavigation.FullName : "N/A",
                    VisitCode = vr.VisitCode,
                })
                .FirstOrDefaultAsync();

            if (visitRegistration == null)
            {
                return NotFound();
            }

            return Ok(visitRegistration);
        }

        // GET: api/VisitRegistrations/customer/5
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<VisitRegistrationDto>>> GetVisitRegistrationsByCustomer(int customerId)
        {
            try
            {
                var visitRegistrations = await _context.VisitRegistrations
                    .Where(vr => vr.CustomerId == customerId)
                    .Include(vr => vr.Niche)
                        .ThenInclude(n => n.Area)
                            .ThenInclude(a => a.Floor)
                                .ThenInclude(f => f.Building)
                    .Include(vr => vr.ApprovedByNavigation) // Include the Staff entity
                    .Select(vr => new VisitRegistrationDto
                    {
                        VisitId = vr.VisitId,
                        CustomerId = vr.CustomerId,
                        NicheId = vr.NicheId,
                        VisitDate = vr.VisitDate,
                        NicheAddress = $"{vr.Niche.Area.Floor.Building.BuildingName} - {vr.Niche.Area.Floor.FloorName} - {vr.Niche.Area.AreaName} - Ô {vr.Niche.NicheName}",
                        Status = vr.Status ?? "No information",
                        ApprovedBy = vr.ApprovedBy,
                        CreatedDate = vr.CreatedDate ?? DateTime.MinValue,
                        Note = vr.Note ?? string.Empty,
                        AccompanyingPeople = (int)vr.AccompanyingPeople,
                        CustomerName = vr.Customer.FullName,
                        StaffName = vr.ApprovedByNavigation != null ? vr.ApprovedByNavigation.FullName : "N/A", // Include StaffName
                        VisitCode = vr.VisitCode,
                    })
                    .ToListAsync();

                if (!visitRegistrations.Any())
                {
                    return NotFound();
                }

                return Ok(visitRegistrations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching visit registrations for customer ID: {CustomerId}", customerId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/VisitRegistrations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVisitRegistration(int id, VisitRegistrationDto visitRegistrationDto)
        {
            var visitRegistration = await _context.VisitRegistrations.FindAsync(id);

            if (visitRegistration == null)
            {
                _logger.LogWarning("VisitRegistration not found: {Id}", id); // Log warning
                return NotFound();
            }

            // Update only the fields that are allowed
            visitRegistration.VisitDate = visitRegistrationDto.VisitDate ?? visitRegistration.VisitDate;
            visitRegistration.Note = visitRegistrationDto.Note ?? visitRegistration.Note;
            visitRegistration.AccompanyingPeople = visitRegistrationDto.AccompanyingPeople;

            _context.Entry(visitRegistration).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitRegistrationExists(id))
                {
                    _logger.LogWarning("VisitRegistration not found during save: {Id}", id); // Log warning
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/VisitRegistrations
        [HttpPost]
        public async Task<ActionResult<VisitRegistration>> PostVisitRegistration(VisitRegistrationDto visitRegistrationDto)
        {
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var utcNow = DateTime.UtcNow;
            var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
            var currentDate = localNow.Date;

            // Lấy thông tin StaffId từ token
            var staffIdClaim = User.FindFirst("StaffId");
            int? approvedBy = null;
            string status = "Pending";

            if (staffIdClaim != null && int.TryParse(staffIdClaim.Value, out int staffId))
            {
                approvedBy = staffId;
                status = "Approved";
            }

            // Đếm số lượng đăng ký trong ngày để tạo mã RegistrationCode
            var registrationsTodayCount = await _context.VisitRegistrations
                .CountAsync(vr => vr.CreatedDate != null && vr.CreatedDate.Value.Date == currentDate);

            var registrationCode = $"DV-{currentDate:yyyyMMdd}-{(registrationsTodayCount + 1):D3}";

            var visitRegistration = new VisitRegistration
            {
                CustomerId = visitRegistrationDto.CustomerId,
                NicheId = visitRegistrationDto.NicheId,
                VisitDate = visitRegistrationDto.VisitDate,
                Note = visitRegistrationDto.Note,
                Status = status,
                ApprovedBy = approvedBy,
                CreatedDate = localNow,
                AccompanyingPeople = visitRegistrationDto.AccompanyingPeople,
                VisitCode = registrationCode
            };

            _context.VisitRegistrations.Add(visitRegistration);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVisitRegistration), new { id = visitRegistration.VisitId }, visitRegistration);
        }


        // DELETE: api/VisitRegistrations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitRegistration(int id)
        {
            var visitRegistration = await _context.VisitRegistrations.FindAsync(id);
            if (visitRegistration == null)
            {
                _logger.LogWarning("VisitRegistration not found: {Id}", id); // Log warning
                return NotFound();
            }

            // Update the status to "Canceled" instead of deleting the record
            visitRegistration.Status = "Canceled";
            _context.Entry(visitRegistration).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.VisitRegistrations.Any(e => e.VisitId == id))
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

        // PUT: api/VisitRegistrations/approve/5
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveVisitRegistration(int id)
        {
            var visitRegistration = await _context.VisitRegistrations.FindAsync(id);

            if (visitRegistration == null)
            {
                return NotFound();
            }

            // Update the status to "Approved"
            visitRegistration.Status = "Approved";
            visitRegistration.ApprovedBy = GetStaffIdFromToken();

            _context.Entry(visitRegistration).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitRegistrationExists(id))
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

        private int GetStaffIdFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                var staffIdClaim = identity.FindFirst(ClaimTypes.NameIdentifier);
                if (staffIdClaim != null)
                {
                    return int.Parse(staffIdClaim.Value);
                }
            }
            throw new UnauthorizedAccessException("Invalid token");
        }

        private bool VisitRegistrationExists(int id)
        {
            return _context.VisitRegistrations.Any(e => e.VisitId == id);
        }
    }
}

public class VisitRegistrationDto
{
    public int VisitId { get; set; }
    public int CustomerId { get; set; }
    public int NicheId { get; set; }
    public string? CustomerName { get; set; }
    public string? StaffName { get; set; }
    public string? NicheAddress { get; set; }
    public DateTime? CreatedDate { get; set; }
    public DateTime? VisitDate { get; set; }
    public string? Status { get; set; } = "Pending";
    public int AccompanyingPeople { get; set; }
    public string? Note { get; set; }
    public int? ApprovedBy { get; set; }
    public string? FormattedVisitDate => VisitDate?.ToString("HH:mm dd/MM/yyyy");
    public string? FormattedCreatedDate => CreatedDate?.ToString("HH:mm dd/MM/yyyy");

    public string? VisitCode { get; set; }
}
