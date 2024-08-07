﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using System.Security.Claims;
using TimeZoneConverter;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NicheReservationsController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly string timeZoneId = TZConvert.WindowsToIana("SE Asia Standard Time");

      
        public NicheReservationsController(CmsContext context)
        {
            _context = context;
        }

        // GET: api/NicheReservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NicheReservationDto>>> GetNicheReservations()
        {
            // Lấy thông tin đơn đặt chỗ
            var reservations = await _context.NicheReservations
                .Include(r => r.Niche)
                    .ThenInclude(n => n.Area)
                        .ThenInclude(a => a.Floor)
                            .ThenInclude(f => f.Building)
                .Select(r => new NicheReservationDto
                {
                    ReservationId = r.ReservationId,
                    ReservationCode = r.ReservationCode,
                    Name = r.Name,
                    PhoneNumber = r.PhoneNumber,
                    NicheAddress = $"{r.Niche.Area.Floor.Building.BuildingName} - {r.Niche.Area.Floor.FloorName} - {r.Niche.Area.AreaName} - {r.Niche.NicheName}",
                    CreatedDate = r.CreatedDate,
                    ConfirmationDate = r.ConfirmationDate,
                    Note = r.Note,
                    Status = r.Status,
                    NicheCode = r.Niche.NicheCode
                })
                .ToListAsync();

            return Ok(reservations);
        }

        // GET: api/NicheReservations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NicheReservation>> GetNicheReservation(int id)
        {
            // Lấy thông tin đơn đặt chỗ theo ID
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
                // Lấy thông tin đơn đặt chỗ theo số điện thoại
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
                        NicheAddress = $"{nr.Niche.Area.Floor.Building.BuildingName} - {nr.Niche.Area.Floor.FloorName} - {nr.Niche.Area.AreaName} - Ô {nr.Niche.NicheName}",
                        CreatedDate = nr.CreatedDate,
                        ConfirmationDate = nr.ConfirmationDate,
                        Note = nr.Note,
                        Status = nr.Status,
                        ReservationCode = nr.ReservationCode
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
            // Lấy thông tin đơn đặt chỗ theo ID
            var existingReservation = await _context.NicheReservations.FindAsync(id);
            if (existingReservation == null)
            {
                return NotFound(new { error = "Reservation not found" });
            }

            if (existingReservation.Status == "Approved")
            {
                return BadRequest(new { error = "Cannot update an approved reservation" });
            }

            // Sửa thông tin đơn đặt chỗ
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
            var currentDate = localNow.Date;

            // Tìm và kiểm tra trạng thái của niche
            var niche = await _context.Niches.FindAsync(createDto.NicheId);
            if (niche == null || niche.Status != "Available")
            {
                return BadRequest(new { error = "Ô chứa này đã được đặt" });
            }

            // Kiểm tra số điện thoại có thuộc về khách hàng hiện tại hay không
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == createDto.PhoneNumber);

            // Xác định số lượng đơn đặt chỗ tối đa được phép
            int maxReservations = customer != null ? 10 : 3;

            // Đếm số lượng đơn đặt chỗ hiện có với trạng thái "Pending"
            var existingReservationsCount = await _context.NicheReservations
                .CountAsync(nr => nr.PhoneNumber == createDto.PhoneNumber && nr.Status == "Pending");

            if (existingReservationsCount >= maxReservations)
            {
                return BadRequest(new { error = $"Số điện thoại này chỉ được đặt tối đa {maxReservations} ô chứa" });
            }


            // Đếm số lượng đơn đặt chỗ đã được thực hiện trong ngày để tạo mã đặt chỗ
            var reservationsTodayCount = await _context.NicheReservations
                .CountAsync(nr => nr.CreatedDate != null && nr.CreatedDate.Value.Date == currentDate);

            var reservationCode = $"DC-{currentDate:yyyyMMdd}-{(reservationsTodayCount + 1):D3}";

            // Lấy thông tin StaffId từ token (nếu có)
            var staffIdClaim = User.FindFirst("StaffId");
            int? confirmedBy = null;
            string status = "Pending";

            if (staffIdClaim != null && !string.IsNullOrEmpty(staffIdClaim.Value))
            {
                if (int.TryParse(staffIdClaim.Value, out int staffId))
                {
                    confirmedBy = staffId;
                    status = "Approved";
                }
            }

            // Tạo mới đơn đặt chỗ
            var nicheReservation = new NicheReservation
            {
                NicheId = createDto.NicheId,
                Name = createDto.Name,
                ConfirmationDate = createDto.ConfirmationDate,
                SignAddress = createDto.SignAddress,
                PhoneNumber = createDto.PhoneNumber,
                Note = createDto.Note,
                CreatedDate = localNow,
                Status = status,
                ReservationCode = reservationCode,
                ConfirmedBy = confirmedBy
            };

            _context.NicheReservations.Add(nicheReservation);

            // Cập nhật trạng thái của niche thành "Booked"
            niche.Status = "Booked";
            _context.Entry(niche).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNicheReservation", new { id = nicheReservation.ReservationId }, nicheReservation);
        }


        // DELETE: api/NicheReservations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNicheReservation(int id)
        {
            // Lấy thông tin đơn đặt chỗ theo ID
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

            // Cập nhật trạng thái của đơn đặt chỗ
            nicheReservation.Status = "Canceled";
            _context.Entry(nicheReservation).State = EntityState.Modified;

            // Chỉ cập nhật trạng thái của niche nếu trạng thái ban đầu không phải là "PendingContractRenewal" hoặc "PendingContractCancellation"
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

        // GET: api/NicheReservations/details/5
        [HttpGet("details/{id}")]
        public async Task<ActionResult<NicheReservationDetailDto>> GetNicheReservationDetail(int id)
        {
            // Lấy thông tin chi tiết đơn đặt chỗ theo ID
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
                ReservationCode = reservation.ReservationCode,
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

        // PUT: api/NicheReservations/update/5
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

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString))
            {
                return BadRequest(new { error = "User ID not found" });
            }

            if (!int.TryParse(userIdString, out int userId))
            {
                return BadRequest(new { error = "Invalid user ID" });
            }

            nicheReservation.Status = "Approved";
            nicheReservation.ConfirmedBy = userId;
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


        // GET: api/NicheReservations/approved
        [HttpGet("approved")]
        public async Task<ActionResult<IEnumerable<NicheReservationApprovedDto>>> GetApprovedNicheReservations()
        {
            try
            {
                // Lấy thông tin đơn đặt chỗ đã được duyệt
                var approvedReservations = await _context.NicheReservations
                    .Where(r => r.Status == "Approved")
                    .Select(r => new NicheReservationApprovedDto
                    {
                        ReservationId = r.ReservationId,
                        ReservationCode = r.ReservationCode,
                        Status = r.Status,
                        CustomerName = r.Name,
                        CustomerPhone = r.PhoneNumber,
                        SignAddress = r.SignAddress,
                        NicheId = r.NicheId,
                        NicheCode = r.Niche.NicheCode,
                        NicheAddress = $"{r.Niche.Area.Floor.Building.BuildingName} - {r.Niche.Area.Floor.FloorName} - {r.Niche.Area.AreaName} - Ô {r.Niche.NicheName}",
                        Note = r.Note

                    })
                    .ToListAsync();

                if (!approvedReservations.Any())
                {
                    return NotFound(new { error = "No approved reservations found" });
                }

                return Ok(approvedReservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
        public string NicheCode { get; set; }

        public string PhoneNumber { get; set; }
        public string NicheAddress { get; set; }
        public string ReservationCode { get; set; }
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
        public string ReservationCode { get; set; }

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
    public class NicheReservationApprovedDto
    {
        public int ReservationId { get; set; }
        public string ReservationCode { get; set; }
        public int NicheId { get; set; }
        public string Status { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string NicheCode { get; set; }
        public string NicheAddress { get; set; }

        public string SignAddress { get; set; }
        public string Note { get; set; }

    }


}
