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
            // Bắt đầu một giao dịch
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Tạo NicheReservation mới
                    var nicheReservation = new NicheReservation
                    {
                        CustomerId = createDto.CustomerId,
                        NicheId = createDto.NicheId,
                        CreatedDate = DateTime.UtcNow,
                        ConfirmationDate = createDto.ConfirmationDate,
                        SignAddress = createDto.SignAddress,
                        PhoneNumber = createDto.PhoneNumber,
                        Note = createDto.Note,
                        Status = "pending",
                        ConfirmedBy = null
                    };

                    _context.NicheReservations.Add(nicheReservation);
                    await _context.SaveChangesAsync();

                    // Lấy Niche tương ứng và cập nhật trạng thái của nó
                    var niche = await _context.Niches.FindAsync(createDto.NicheId);
                    if (niche == null)
                    {
                        throw new Exception("Niche không tồn tại");
                    }

                    niche.Status = "Booked";
                    _context.Entry(niche).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    // Commit giao dịch
                    await transaction.CommitAsync();

                    return CreatedAtAction("GetNicheReservation", new { id = nicheReservation.ReservationId }, nicheReservation);
                }
                catch (Exception)
                {
                    // Rollback giao dịch nếu có lỗi xảy ra
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        // DELETE: api/NicheReservations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNicheReservation(int id)
        {
            // Bắt đầu một giao dịch
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var nicheReservation = await _context.NicheReservations.FindAsync(id);
                    if (nicheReservation == null)
                    {
                        return NotFound();
                    }

                    // Lấy Niche tương ứng và cập nhật trạng thái của nó
                    var niche = await _context.Niches.FindAsync(nicheReservation.NicheId);
                    if (niche == null)
                    {
                        throw new Exception("Niche không tồn tại");
                    }

                    niche.Status = "Available";
                    _context.Entry(niche).State = EntityState.Modified;

                    _context.NicheReservations.Remove(nicheReservation);
                    await _context.SaveChangesAsync();

                    // Commit giao dịch
                    await transaction.CommitAsync();

                    return NoContent();
                }
                catch (Exception)
                {
                    // Rollback giao dịch nếu có lỗi xảy ra
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        // GET: api/NicheReservations/Customer/5
        [HttpGet("Customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<NicheReservation>>> GetNicheReservationsByCustomerId(int customerId)
        {
            var nicheReservations = await _context.NicheReservations
                .Where(nr => nr.CustomerId == customerId)
                .ToListAsync();

            if (nicheReservations == null || !nicheReservations.Any())
            {
                return NotFound();
            }

            return nicheReservations;
        }

        private bool NicheReservationExists(int id)
        {
            return _context.NicheReservations.Any(e => e.ReservationId == id);
        }
    }

    public class CreateNicheReservationDto
    {
        public int CustomerId { get; set; }
        public int NicheId { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public String SignAddress { get; set; }
        public String PhoneNumber { get; set; }
        public String Note { get; set; }
    }
}
