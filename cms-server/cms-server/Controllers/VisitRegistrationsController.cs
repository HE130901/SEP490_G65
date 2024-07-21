using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using Microsoft.Extensions.Logging; // Add logging

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitRegistrationsController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly ILogger<VisitRegistrationsController> _logger; 

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
                    .Select(vr => new VisitRegistrationDto
                    {
                        VisitId = vr.VisitId,
                        CustomerId = vr.CustomerId,
                        NicheId = vr.NicheId,
                        VisitDate = vr.VisitDate,
                        Status = vr.Status ?? "No information",
                        ApprovedBy = vr.ApprovedBy,
                        CreatedDate = vr.CreatedDate ?? DateTime.MinValue,
                        Note = vr.Note ?? string.Empty,
                        AccompanyingPeople = (int)vr.AccompanyingPeople
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
        public async Task<ActionResult<VisitRegistration>> GetVisitRegistration(int id)
        {
            var visitRegistration = await _context.VisitRegistrations.FindAsync(id);

            if (visitRegistration == null)
            {
                return NotFound();
            }

            return visitRegistration;
        }

        // GET: api/VisitRegistrations/customer/5
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<VisitRegistrationDto>>> GetVisitRegistrationsByCustomer(int customerId)
        {
            try
            {
                var visitRegistrations = await _context.VisitRegistrations
                    .Where(vr => vr.CustomerId == customerId)
                    .Select(vr => new VisitRegistrationDto
                    {
                        VisitId = vr.VisitId,
                        NicheId = vr.NicheId,
                        CreatedDate = vr.CreatedDate ?? DateTime.MinValue,
                        VisitDate = vr.VisitDate,
                        Status = vr.Status ?? "No infomation",
                        AccompanyingPeople = (int)vr.AccompanyingPeople,
                        Note = vr.Note ?? string.Empty
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
                _logger.LogError(ex, "Error fetching visit registrations for customer ID: {CustomerId}", customerId); // Log error
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
            var visitRegistration = new VisitRegistration
            {
                CustomerId = visitRegistrationDto.CustomerId,
                NicheId = visitRegistrationDto.NicheId,
                VisitDate = visitRegistrationDto.VisitDate,
                Note = visitRegistrationDto.Note,
                Status = "Pending",
                ApprovedBy = null,
                CreatedDate = DateTime.Now,
                AccompanyingPeople = visitRegistrationDto.AccompanyingPeople
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
    public DateTime? CreatedDate { get; set; }
    public DateTime? VisitDate { get; set; }
    public string? Status { get; set; } = "Pending";
    public int AccompanyingPeople { get; set; }
    public string? Note { get; set; }

    public int? ApprovedBy { get; set; }
}
