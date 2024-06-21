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
    public class VisitRegistrationsController : ControllerBase
    {
        private readonly CmsContext _context;

        public VisitRegistrationsController(CmsContext context)
        {
            _context = context;
        }

        // GET: api/VisitRegistrations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VisitRegistration>>> GetVisitRegistrations()
        {
            return await _context.VisitRegistrations.ToListAsync();
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
        public async Task<ActionResult<IEnumerable<VisitRegistration>>> GetVisitRegistrationsByCustomer(int customerId)
        {
            var visitRegistrations = await _context.VisitRegistrations
                .Where(vr => vr.CustomerId == customerId)
                .ToListAsync();

            if (!visitRegistrations.Any())
            {
                return NotFound();
            }

            return visitRegistrations;
        }

        // PUT: api/VisitRegistrations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVisitRegistration(int id, VisitRegistration visitRegistration)
        {
            if (id != visitRegistration.VisitId)
            {
                return BadRequest();
            }

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

        // POST: api/VisitRegistrations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<VisitRegistration>> PostVisitRegistration(VisitRegistrationDto visitRegistrationDto)
        {
            var visitRegistration = new VisitRegistration
            {
                CustomerId = visitRegistrationDto.CustomerId,
                NicheId = visitRegistrationDto.NicheId,
                VisitDate = visitRegistrationDto.VisitDate,
                Note = visitRegistrationDto.note,
                Status = "Pending", // Set default status to pending
                ApprovedBy = null, // Set ApprovedBy to null
                ApprovalDate = null // Set ApprovalDate to null
            };

            _context.VisitRegistrations.Add(visitRegistration);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVisitRegistration", new { id = visitRegistration.VisitId }, visitRegistration);
        }

        // DELETE: api/VisitRegistrations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitRegistration(int id)
        {
            var visitRegistration = await _context.VisitRegistrations.FindAsync(id);
            if (visitRegistration == null)
            {
                return NotFound();
            }

            _context.VisitRegistrations.Remove(visitRegistration);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VisitRegistrationExists(int id)
        {
            return _context.VisitRegistrations.Any(e => e.VisitId == id);
        }
    }

    public class VisitRegistrationDto
    {
        public int CustomerId { get; set; }
        public int NicheId { get; set; }
        public DateTime VisitDate { get; set; }
        public String note { get; set; }
    }
}
