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
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using cms_server.DTOs;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NicheReservationsController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly string timeZoneId = TZConvert.WindowsToIana("SE Asia Standard Time");
        private readonly IConfiguration _configuration;

        public NicheReservationsController(CmsContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private bool NicheReservationExists(int id)
        {
            return _context.NicheReservations.Any(e => e.ReservationId == id);
        }

        private void SendEmail(string recipientEmail, string subject, string messageBody)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(
                _configuration["SmtpSettings:SenderName"],
                _configuration["SmtpSettings:SenderEmail"]));
            emailMessage.To.Add(new MailboxAddress(recipientEmail, recipientEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(TextFormat.Html) { Text = messageBody };

            using (var client = new SmtpClient())
            {
                client.Connect(
                    _configuration["SmtpSettings:Server"],
                    int.Parse(_configuration["SmtpSettings:Port"]),
                    MailKit.Security.SecureSocketOptions.StartTls);
                client.Authenticate(
                    _configuration["SmtpSettings:Username"],
                    _configuration["SmtpSettings:Password"]);
                client.Send(emailMessage);
                client.Disconnect(true);
            }
        }

        private void SendReservationConfirmationEmail(string customerEmail, NicheReservation nicheReservation, Niche niche)
        {
            try
            {
                // Kiểm tra các đối tượng đầu vào để đảm bảo không có đối tượng nào là null
                if (string.IsNullOrEmpty(customerEmail))
                {
                    throw new ArgumentNullException(nameof(customerEmail), "Customer email is null or empty");
                }
                if (nicheReservation == null)
                {
                    throw new ArgumentNullException(nameof(nicheReservation), "NicheReservation object is null");
                }
                if (niche == null)
                {
                    throw new ArgumentNullException(nameof(niche), "Niche object is null");
                }

                // Chuẩn bị thông tin email
                var subject = "Xác nhận Đơn Đăng Ký Đặt Chỗ - Dịch vụ An Bình Viên";
                var messageBody = $@"
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2 style='color: #333;'>Kính gửi {nicheReservation.Name},</h2>
                    <p>Chúng tôi xin chân thành cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của An Bình Viên. Chúng tôi xin thông báo đơn đăng ký đặt chỗ của quý khách đã được tạo thành công </p>
                   

                    <h3 style='color: #555;'>Thông tin Đơn Đăng Ký</h3>
                    <ul>
                        <li><strong>Mã đặt chỗ:</strong> {nicheReservation.ReservationCode}</li>
                        <li><strong>Ngày đăng ký:</strong> {nicheReservation.CreatedDate:dd/MM/yyyy}</li>
                        <li><strong>Số điện thoại:</strong> {nicheReservation.PhoneNumber}</li>
                        <li><strong>Email:</strong> {customerEmail}</li>
                    </ul>

                    <p>Quý khách vui lòng chờ phản hồi từ hệ thống trong vòng 48h</p>
                    <p>Nếu có bất kỳ thắc mắc nào, quý khách hàng vui lòng liên hệ với chúng tôi qua số điện thoại (+84)999-999-999 hoặc Email info@abv.com.</p>
                    <p>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng An Bình Viên</p>
                    <hr style='border-top: 1px solid #ccc;' />
                    <p style='color: #888;'>Email này được gửi từ hệ thống của An Bình Viên. Xin vui lòng không trả lời trực tiếp email này.</p>
                </div>";

                // Gửi email sử dụng hàm SendEmail
                SendEmail(customerEmail, subject, messageBody);

                // Ghi log thành công
                Console.WriteLine("Email confirmation sent successfully to " + customerEmail);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và ghi log
                Console.WriteLine($"An error occurred while sending reservation confirmation email: {ex.Message}");
                throw new Exception("Failed to send reservation confirmation email.", ex);
            }
        }

        private void SendCancellationEmail(string customerEmail, NicheReservation nicheReservation, Niche niche)
        {
            try
            {
                var subject = "Hủy Đơn Đăng Ký Đặt Chỗ - Dịch vụ An Bình Viên";
                var messageBody = $@"
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2 style='color: #333;'>Kính gửi {nicheReservation.Name},</h2>
                    <p>Chúng tôi rất tiếc phải thông báo rằng đơn đăng ký đặt chỗ của quý khách đã bị hủy.</p>
                    <h3 style='color: #555;'>Thông tin Đơn Đăng Ký</h3>
                    <ul>
                        <li><strong>Mã đặt chỗ:</strong> {nicheReservation.ReservationCode}</li>
                        <li><strong>Ngày đăng ký:</strong> {nicheReservation.CreatedDate:dd/MM/yyyy}</li>
                    </ul>
                    <p>Nếu có bất kỳ thắc mắc nào, quý khách hàng vui lòng liên hệ với chúng tôi qua số điện thoại (+84)999-999-999 hoặc Email info@abv.com.</p>
                    <p>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng An Bình Viên</p>
                </div>";

                // Gửi email sử dụng hàm SendEmail
                SendEmail(customerEmail, subject, messageBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while sending cancellation email: {ex.Message}");
            }
        }

        private void SendApprovalEmail(string customerEmail, NicheReservation nicheReservation, Niche niche)
        {
            try
            {
                var subject = "Duyệt Đơn Đăng Ký Đặt Chỗ - Dịch vụ An Bình Viên";
                var messageBody = $@"
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2 style='color: #333;'>Kính gửi {nicheReservation.Name},</h2>
                    <p>Chúng tôi xin thông báo rằng đơn đăng ký đặt chỗ của quý khách đã được duyệt thành công.</p>
                    <p>Quý khách vui lòng đến đúng thời gian và địa điểm đã hẹn.</p>

                    <h3 style='color: #555;'>Thông tin Đơn Đăng Ký</h3>
                    <ul>
                        <li><strong>Mã đặt chỗ:</strong> {nicheReservation.ReservationCode}</li>
                        <li><strong>Ngày hẹn:</strong> {nicheReservation.ConfirmationDate:dd/MM/yyyy}</li>
                        <li><strong>Địa điểm hẹn:</strong> {nicheReservation.SignAddress}</li>
                    </ul>
                    <p>Nếu có bất kỳ thắc mắc nào, quý khách hàng vui lòng liên hệ với chúng tôi qua số điện thoại (+84)999-999-999 hoặc Email info@abv.com.</p>
                    <p>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng An Bình Viên</p>
                </div>";

                // Gửi email sử dụng hàm SendEmail
                SendEmail(customerEmail, subject, messageBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while sending approval email: {ex.Message}");
            }
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

        // GET: api/NicheReservations/details/5
        // endpoint dành cho nhân viên
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
                NicheAddress = $"{reservation.Niche.Area.Floor.Building.BuildingName}-{reservation.Niche.Area.Floor.FloorName}-{reservation.Niche.Area.AreaName}-Ô {reservation.Niche.NicheName}",
                NicheId = reservation.NicheId,
                CreatedDate = reservation.CreatedDate,
                ConfirmationDate = reservation.ConfirmationDate,
                Status = reservation.Status,
                Note = reservation.Note,
                SignAddress = reservation.SignAddress,
                NameConfirmedBy = reservation.ConfirmedByNavigation?.FullName,
                Email = reservation.Email
            };

            return Ok(reservationDetail);
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
                        Note = r.Note,
                        CustomerEmail = r.Email
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

        // POST: api/NicheReservations
        [HttpPost]
        public async Task<ActionResult<NicheReservation>> PostNicheReservation(CreateNicheReservationDto createDto)
        {
            // Sử dụng một transaction để đảm bảo tính toàn vẹn của dữ liệu
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Lấy thông tin về thời gian
                    var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
                    var utcNow = DateTime.UtcNow;
                    var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
                    var currentDate = localNow.Date;

                    // Tìm và kiểm tra trạng thái của ô chứa (niche) dựa trên ID được cung cấp
                    var niche = await _context.Niches.FindAsync(createDto.NicheId);

                    // Nếu ô chứa không tồn tại hoặc không có trạng thái "Available", trả về lỗi
                    if (niche == null || niche.Status != "Available")
                    {
                        return BadRequest(new { error = "Ô chứa này đã được đặt" });
                    }

                    // Kiểm tra xem số điện thoại có thuộc về khách hàng hiện tại trong cơ sở dữ liệu không
                    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == createDto.PhoneNumber);

                    // Xác định số lượng đơn đặt chỗ tối đa mà khách hàng được phép dựa trên việc khách hàng đã tồn tại hay chưa
                    int maxReservations = customer != null ? 10 : 3;

                    // Đếm số lượng đơn đặt chỗ hiện có với trạng thái "Pending" cho cùng số điện thoại
                    var existingReservationsCount = await _context.NicheReservations
                        .CountAsync(nr => nr.PhoneNumber == createDto.PhoneNumber && nr.Status == "Pending");

                    // Nếu số đơn đặt chỗ đã đạt đến giới hạn, trả về lỗi
                    if (existingReservationsCount >= maxReservations)
                    {
                        return BadRequest(new { error = $"Số điện thoại này chỉ được đặt tối đa {maxReservations} ô chứa" });
                    }

                    // Đếm số lượng đơn đặt chỗ đã được thực hiện trong ngày để tạo mã đặt chỗ duy nhất
                    var reservationsTodayCount = await _context.NicheReservations
                        .CountAsync(nr => nr.CreatedDate != null && nr.CreatedDate.Value.Date == currentDate);

                    // Tạo mã đặt chỗ với định dạng "DC-yyyyMMdd-xxx" (xxx là số thứ tự trong ngày)
                    var reservationCode = $"DC-{currentDate:yyyyMMdd}-{(reservationsTodayCount + 1):D3}";

                    // Lấy thông tin StaffId từ token nếu có (dành cho trường hợp đơn đặt chỗ được nhân viên xác nhận)
                    var staffIdClaim = User.FindFirst("StaffId");
                    int? confirmedBy = null;
                    string status = "Pending";

                    // Nếu có StaffId trong token và nó hợp lệ, cập nhật thông tin xác nhận và trạng thái đơn đặt chỗ
                    if (staffIdClaim != null && !string.IsNullOrEmpty(staffIdClaim.Value))
                    {
                        if (int.TryParse(staffIdClaim.Value, out int staffId))
                        {
                            confirmedBy = staffId;
                            status = "Approved";
                        }
                    }

                    // Tạo đối tượng NicheReservation mới và gán các giá trị từ DTO
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
                        Email = createDto.Email,
                        ConfirmedBy = confirmedBy
                    };

                    // Thêm đơn đặt chỗ mới vào context
                    _context.NicheReservations.Add(nicheReservation);

                    // Cập nhật trạng thái của ô chứa thành "Booked"
                    niche.Status = "Booked";
                    _context.Entry(niche).State = EntityState.Modified;

                    // Lưu các thay đổi vào cơ sở dữ liệu và commit transaction để hoàn tất
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    // Gửi email xác nhận đơn đặt chỗ cho khách hàng
                    SendReservationConfirmationEmail(nicheReservation.Email, nicheReservation, niche);

                    // Trả về kết quả thành công với thông tin của đơn đặt chỗ mới được tạo
                    return CreatedAtAction("GetNicheReservation", new { id = nicheReservation.ReservationId }, nicheReservation);
                }
                catch (Exception ex)
                {
                    // Nếu có lỗi xảy ra, rollback transaction và trả về lỗi
                    await transaction.RollbackAsync();
                    return BadRequest(new { error = "Đã xảy ra lỗi khi đặt chỗ" });
                }
            }
        }

        // DELETE: api/NicheReservations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNicheReservation(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Lấy thông tin đơn đặt chỗ theo ID
                    var nicheReservation = await _context.NicheReservations.FindAsync(id);
                    if (nicheReservation == null)
                    {
                        return NotFound(new { error = "Không tìm thấy đơn đặt chỗ" });
                    }

                    // Không thể xóa đơn đặt chỗ đã được duyệt
                    if (nicheReservation.Status == "Approved")
                    {
                        return BadRequest(new { error = "Không thể xóa đơn đã được duyệt" });
                    }

                    var originalStatus = nicheReservation.Status;

                    // Cập nhật trạng thái của đơn đặt chỗ thành "Canceled"
                    nicheReservation.Status = "Canceled";
                    _context.Entry(nicheReservation).State = EntityState.Modified;

                    // Nếu trạng thái ban đầu không phải là "PendingContractRenewal" hoặc "PendingContractCancellation", cập nhật trạng thái ô chứa
                    if (originalStatus != "PendingContractRenewal" && originalStatus != "PendingContractCancellation")
                    {
                        var niche = await _context.Niches.FindAsync(nicheReservation.NicheId);
                        if (niche != null)
                        {
                            // Cập nhật trạng thái ô chứa thành "Available"
                            niche.Status = "Available";
                            _context.Entry(niche).State = EntityState.Modified;
                        }
                    }

                    // Lưu các thay đổi vào cơ sở dữ liệu và commit transaction
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    //Gửi email thông báo hủy đơn đặt chỗ
                    SendCancellationEmail(nicheReservation.Email, nicheReservation, nicheReservation.Niche);

                    // Trả về kết quả thành công
                    return NoContent();
                }
                catch (Exception ex)
                {
                    // Rollback transaction nếu có lỗi xảy ra
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { error = "Đã xảy ra lỗi khi hủy đơn đặt chỗ" });
                }
            }
        }

        // PUT: api/NicheReservations/5
        // Endpoint cập nhật thông tin đơn đặt chỗ dành cho khách hàng.
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

        // PUT: api/NicheReservations/update/5
        // Endpoint cập nhật thông tin đơn đặt chỗ dành cho nhân viên.
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateNicheReservation(int id, [FromBody] UpdateNicheReservationDto dto)
        {
            //check nếu người đăng nhập là nhân viên hay không
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

            //check tồn tại của đơn đặt ô chứa
            var nicheReservation = await _context.NicheReservations.FindAsync(id);
            if (nicheReservation == null)
            {
                return NotFound("Reservation not found");
            }

            // Update only the specified fields
            nicheReservation.ConfirmationDate = dto.ConfirmationDate;
            nicheReservation.Note = dto.Note;
            nicheReservation.SignAddress = dto.SignAddress;
            nicheReservation.ConfirmedBy = int.Parse(userId); 
            // nicheReservation.Status = "Approved";

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
            //Tìm kiếm và kiểm tra đơn đặt chỗ theo ID
            var nicheReservation = await _context.NicheReservations.FindAsync(id);
            if (nicheReservation == null)
            {
                return NotFound(new { error = "Reservation not found" });
            }

            if (nicheReservation.Status == "Approved")
            {
                return BadRequest(new { error = "Reservation is already approved" });
            }

            //Check nếu người đăng nhập là nhân viên hay không
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString))
            {
                return BadRequest(new { error = "User ID not found" });
            }
            if (!int.TryParse(userIdString, out int userId))
            {
                return BadRequest(new { error = "Invalid user ID" });
            }

            //Gửi thông báo qua email
            SendApprovalEmail(nicheReservation.Email, nicheReservation, nicheReservation.Niche);

            //Cập nhật trạng thái đơn đặt chỗ thành "Approved"
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

    }
}
