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

        // GET: api/NicheReservations/by-phone/{phoneNumber}
        [HttpGet("by-phone/{phoneNumber}")]
        public async Task<ActionResult<IEnumerable<NicheReservation>>> GetNicheReservationsByPhoneNumber(string phoneNumber)
        {
            var nicheReservations = await _context.NicheReservations
                .Where(nr => nr.PhoneNumber == phoneNumber)
                .ToListAsync();

            if (!nicheReservations.Any())
            {
                return NotFound(new { error = "Không tìm thấy đơn đặt chỗ nào cho số điện thoại này" });
            }

            return nicheReservations;
        }

        // PUT: api/NicheReservations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNicheReservation(int id, [FromBody] UpdateNicheReservationDto updateDto)
        {
            if (id != updateDto.ReservationId)
            {
                return BadRequest(new { error = "Reservation ID mismatch" });
            }

            var existingReservation = await _context.NicheReservations.FindAsync(id);
            if (existingReservation == null)
            {
                return NotFound(new { error = "Reservation not found" });
            }

            if (existingReservation.Status == "Approved")
            {
                return BadRequest(new { error = "Cannot update an approved reservation" });
            }

            // Update only the specified properties
            existingReservation.NicheId = updateDto.NicheId;
            existingReservation.ConfirmationDate = updateDto.ConfirmationDate;
            existingReservation.Note = updateDto.Note;
            existingReservation.SignAddress = updateDto.SignAddress;
            existingReservation.PhoneNumber = updateDto.PhoneNumber;
            existingReservation.Name = updateDto.Name;

            _context.Entry(existingReservation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NicheReservationExists(id))
                {
                    return NotFound(new { error = "Reservation not found during save" });
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
            // Kiểm tra xem số điện thoại có thuộc về một khách hàng hay không
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == createDto.PhoneNumber);

            if (customer != null)
            {
                // Khách hàng không bị giới hạn số lượng chỗ đặt
                var nicheReservation = new NicheReservation
                {
                    NicheId = createDto.NicheId,
                    Name = createDto.Name,
                    ConfirmationDate = createDto.ConfirmationDate,
                    SignAddress = createDto.SignAddress,
                    PhoneNumber = createDto.PhoneNumber,
                    Note = createDto.Note,
                    CreatedDate = DateTime.UtcNow,
                    Status = "Pending"
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
            else
            {
                // Guest bị giới hạn số lượng chỗ đặt
                var existingReservationsCount = await _context.NicheReservations
                    .CountAsync(nr => nr.PhoneNumber == createDto.PhoneNumber && nr.Status == "Pending");

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
                    Status = "Pending"
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

            if (nicheReservation.Status == "Approved")
            {
                return BadRequest(new { error = "Không thể xóa đơn đặt chỗ đã được duyệt" });
            }

            // Update the status of the reservation to "Canceled"
            nicheReservation.Status = "Canceled";
            _context.Entry(nicheReservation).State = EntityState.Modified;

            // Update the status of the niche to "Available"
            var niche = await _context.Niches.FindAsync(nicheReservation.NicheId);
            if (niche != null)
            {
                niche.Status = "Available";
                _context.Entry(niche).State = EntityState.Modified;
            }

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

    // DTO for updating niche reservation
    public class UpdateNicheReservationDto
    {
        public int ReservationId { get; set; }
        public int NicheId { get; set; }
        public string Name { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string SignAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string? Note { get; set; }
    }
}
