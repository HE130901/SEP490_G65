using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using System.Security.Claims;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NicheReservationDto>>> GetNicheReservations()
        {
            var reservations = await _context.NicheReservations
                .Include(r => r.Niche)
                    .ThenInclude(n => n.Area)
                        .ThenInclude(a => a.Floor)
                            .ThenInclude(f => f.Building)
                .Select(r => new NicheReservationDto
                {
                    ReservationId = r.ReservationId,
                    Name = r.Name,
                    PhoneNumber = r.PhoneNumber,
                    NicheAddress = $"{r.Niche.Area.Floor.Building.BuildingName}-{r.Niche.Area.Floor.FloorName}-{r.Niche.Area.AreaName}-{r.Niche.NicheName}",
                    CreatedDate = r.CreatedDate,
                    ConfirmationDate = r.ConfirmationDate,
                    Status = r.Status
                })
                .ToListAsync();

            return Ok(reservations);
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
                return BadRequest(new { error = "Không thể xóa đơn đã được duyệt" });
            }

            var originalStatus = nicheReservation.Status;

            // Update the status of the reservation to "Canceled"
            nicheReservation.Status = "Canceled";
            _context.Entry(nicheReservation).State = EntityState.Modified;

            // Only update the Niche status if the original reservation status was not "PendingContractRenewal" or "PendingContractCancellation"
            if (originalStatus != "PendingContractRenewal" && originalStatus != "PendingContractCancellation")
            {
                var niche = await _context.Niches.FindAsync(nicheReservation.NicheId);
                if (niche != null)
                {
                    niche.Status = "Available";
                    _context.Entry(niche).State = EntityState.Modified;
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("details/{id}")]
        public async Task<ActionResult<NicheReservationDetailDto>> GetNicheReservationDetail(int id)
        {
            var reservation = await _context.NicheReservations
                .Include(r => r.Niche)
                    .ThenInclude(n => n.Area)
                        .ThenInclude(a => a.Floor)
                            .ThenInclude(f => f.Building)
                .Include(r => r.ConfirmedByNavigation)
                .FirstOrDefaultAsync(r => r.ReservationId == id);

            if (reservation == null)
            {
                return NotFound();
            }

            var reservationDetail = new NicheReservationDetailDto
            {
                ReservationId = reservation.ReservationId,
                Name = reservation.Name,
                PhoneNumber = reservation.PhoneNumber,
                NicheAddress = $"{reservation.Niche.Area.Floor.Building.BuildingName}-{reservation.Niche.Area.Floor.FloorName}-{reservation.Niche.Area.AreaName}-{reservation.Niche.NicheName}",
                NicheId = reservation.NicheId,
                CreatedDate = reservation.CreatedDate,
                ConfirmationDate = reservation.ConfirmationDate,
                Status = reservation.Status,
                SignAddress = reservation.SignAddress,
                NameConfirmedBy = reservation.ConfirmedByNavigation?.FullName
            };

            return Ok(reservationDetail);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateNicheReservation(int id, [FromBody] UpdateNicheReservationDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == null)
            {
                return Unauthorized("User role not found in token.");
            }

            var nicheReservation = await _context.NicheReservations.FindAsync(id);

            if (nicheReservation == null)
            {
                return NotFound("Reservation not found");
            }

            // Get the old niche ID
            var oldNicheId = nicheReservation.NicheId;

            // Update the fields
            nicheReservation.NicheId = dto.NicheId;
            nicheReservation.ConfirmationDate = dto.ConfirmationDate;
            nicheReservation.Note = dto.Note;
            nicheReservation.SignAddress = dto.SignAddress;
            nicheReservation.PhoneNumber = dto.PhoneNumber;
            nicheReservation.Name = dto.Name;
            nicheReservation.ConfirmedBy = int.Parse(userId); // Extracted from token
            nicheReservation.Status = "Approved";

            try
            {
                // Update the status of the old niche to "Available"
                var oldNiche = await _context.Niches.FindAsync(oldNicheId);
                if (oldNiche != null)
                {
                    oldNiche.Status = "Available";
                }

                // Update the status of the new niche to "Booked"
                var newNiche = await _context.Niches.FindAsync(dto.NicheId);
                if (newNiche != null)
                {
                    newNiche.Status = "Booked";
                }

                await _context.SaveChangesAsync();
                return Ok(nicheReservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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

    public class NicheReservationDto
    {
        public int ReservationId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string NicheAddress { get; set; } 
        public DateTime? CreatedDate { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string Status { get; set; }
    }
    public class NicheReservationDetailDto
    {
        public int ReservationId { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string NicheAddress { get; set; } 
        public int NicheId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string Status { get; set; }
        public string SignAddress { get; set; }
        public string NameConfirmedBy { get; set; }
    }
    public class UpdateNicheReservationForStaffDto
    {
        public int NicheId { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string? Note { get; set; }
        public string? SignAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Name { get; set; }
    }




}
