using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using System.Security.Claims;
using TimeZoneConverter;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NicheReservationsController : ControllerBase
    {
        private readonly CmsContext _context;
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
                    NicheAddress = $"{r.Niche.Area.Floor.Building.BuildingName} - {r.Niche.Area.Floor.FloorName} - {r.Niche.Area.AreaName} - {r.Niche.NicheName}",
                    CreatedDate = r.CreatedDate,
                    ConfirmationDate = r.ConfirmationDate,
                    Note = r.Note,
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
        public async Task<ActionResult<IEnumerable<NicheReservationDto>>> GetNicheReservationsByPhoneNumber(string phoneNumber)
        {
            try
            {
                var nicheReservations = await _context.NicheReservations
                    .Where(nr => nr.PhoneNumber == phoneNumber)
                    .Include(nr => nr.Niche)
                        .ThenInclude(n => n.Area)
                            .ThenInclude(a => a.Floor)
                                .ThenInclude(f => f.Building)
                    .Select(nr => new NicheReservationDto
                    {
                        ReservationId = nr.ReservationId,
                        Name = nr.Name,
                        PhoneNumber = nr.PhoneNumber,
                        NicheAddress = $"{nr.Niche.Area.Floor.Building.BuildingName}-{nr.Niche.Area.Floor.FloorName}-{nr.Niche.Area.AreaName}-Ô {nr.Niche.NicheName}",
                        CreatedDate = nr.CreatedDate,
                        ConfirmationDate = nr.ConfirmationDate,
                        Note = nr.Note,
                        Status = nr.Status
                    })
                    .ToListAsync();

                if (!nicheReservations.Any())
                {
                    return NotFound(new { error = "Không tìm thấy đơn đặt chỗ nào cho số điện thoại này" });
                }

                return Ok(nicheReservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/NicheReservations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNicheReservation(int id, [FromBody] UpdateNicheReservationDto updateDto)
        {
           
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
            existingReservation.ConfirmationDate = updateDto.ConfirmationDate;
            existingReservation.Note = updateDto.Note;
            existingReservation.SignAddress = updateDto.SignAddress;

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

            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var utcNow = DateTime.UtcNow;
            var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);

            // Find the niche to check its status
            var niche = await _context.Niches.FindAsync(createDto.NicheId);
            if (niche == null || niche.Status != "Available")
            {
                return BadRequest(new { error = "Ô chứa không khả dụng để đặt chỗ" });
            }

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
                    CreatedDate = localNow,
                    Status = "Pending"
                };

                _context.NicheReservations.Add(nicheReservation);

                // Update the status of the niche to "Booked"
                niche.Status = "Booked";
                _context.Entry(niche).State = EntityState.Modified;

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
                    CreatedDate = localNow,
                    Status = "Pending"
                };

                _context.NicheReservations.Add(nicheReservation);

                // Update the status of the niche to "Booked"
                niche.Status = "Booked";
                _context.Entry(niche).State = EntityState.Modified;

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
                Note = reservation.Note,
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

            // Update only the specified fields
            nicheReservation.ConfirmationDate = dto.ConfirmationDate;
            nicheReservation.Note = dto.Note;
            nicheReservation.SignAddress = dto.SignAddress;
            nicheReservation.ConfirmedBy = int.Parse(userId); // Extracted from token
            nicheReservation.Status = "Approved";

            try
            {
                await _context.SaveChangesAsync();
                return Ok(nicheReservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // PUT: api/NicheReservations/confirm/5
        [HttpPut("confirm/{id}")]
        public async Task<IActionResult> ConfirmNicheReservation(int id)
        {
            var nicheReservation = await _context.NicheReservations.FindAsync(id);
            if (nicheReservation == null)
            {
                return NotFound(new { error = "Reservation not found" });
            }

            if (nicheReservation.Status == "Approved")
            {
                return BadRequest(new { error = "Reservation is already approved" });
            }

            nicheReservation.Status = "Approved";
            nicheReservation.ConfirmedBy = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            _context.Entry(nicheReservation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
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
        public DateTime? ConfirmationDate { get; set; }
        public string SignAddress { get; set; }
        public string Note { get; set; }
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
        public string Note { get; set; }
        public string FormattedCreatedDate => CreatedDate?.ToString("HH:mm dd/MM/yyyy");
        public string FormattedConfirmationDate => ConfirmationDate?.ToString("HH:mm dd/MM/yyyy");
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
        public string Note { get; set; }
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
