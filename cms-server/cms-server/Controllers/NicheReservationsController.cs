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
    public class NicheReservationsController : ControllerBase
    {
        private readonly CmsContext _context;

        public NicheReservationsController(CmsContext context)
        {
            _context = context;
        }

        // GET: api/NicheReservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NicheReservation>>> GetNicheReservations()
        {
            return await _context.NicheReservations.ToListAsync();
        }

        // GET: api/NicheReservations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NicheReservation>> GetNicheReservation(int id)
        {
            var nicheReservation = await _context.NicheReservations.FindAsync(id);

            if (nicheReservation == null)
            {
                return NotFound();
            }

            return nicheReservation;
        }

        // PUT: api/NicheReservations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNicheReservation(int id, NicheReservation nicheReservation)
        {
            if (id != nicheReservation.ReservationId)
            {
                return BadRequest();
            }

            _context.Entry(nicheReservation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NicheReservationExists(id))
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

        // POST: api/NicheReservations
        [HttpPost]
        public async Task<ActionResult<NicheReservation>> PostNicheReservation(CreateNicheReservationDto createDto)
        {
            // Check if the phone number already has 3 reservations
            var existingReservationsCount = await _context.NicheReservations
                .CountAsync(nr => nr.PhoneNumber == createDto.PhoneNumber && nr.Status == "Đang giữ chỗ");

            if (existingReservationsCount >= 3)
            {
                return BadRequest(new { error = "Mỗi số điện thoại chỉ được đặt tối đa 3 ô chứa" });
            }

            var nicheReservation = new NicheReservation
            {
                NicheId = createDto.NicheId,
                Name = createDto.Name,
                ConfirmationDate = createDto.ConfirmationDate,
                SignAddress = createDto.SignAddress,
                PhoneNumber = createDto.PhoneNumber,
                Note = createDto.Note,
                CreatedDate = DateTime.UtcNow,
                Status = "Đang giữ chỗ"
            };

            _context.NicheReservations.Add(nicheReservation);

            // Update the status of the niche to "Booked"
            var niche = await _context.Niches.FindAsync(createDto.NicheId);
            if (niche != null)
            {
                niche.Status = "Booked";
                _context.Entry(niche).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNicheReservation", new { id = nicheReservation.ReservationId }, nicheReservation);
        }

        // DELETE: api/NicheReservations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNicheReservation(int id)
        {
            var nicheReservation = await _context.NicheReservations.FindAsync(id);
            if (nicheReservation == null)
            {
                return NotFound();
            }

            _context.NicheReservations.Remove(nicheReservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NicheReservationExists(int id)
        {
            return _context.NicheReservations.Any(e => e.ReservationId == id);
        }

    }

    public class CreateNicheReservationDto
    {
        public int NicheId { get; set; }
        public string Name { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string SignAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string? Note { get; set; }
    }
}
