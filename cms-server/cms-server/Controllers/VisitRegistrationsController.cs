using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using TimeZoneConverter;
using cms_server.Configuration;
using cms_server.DTOs;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitRegistrationsController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly ILogger<VisitRegistrationsController> _logger;
        private readonly string timeZoneId = TZConvert.WindowsToIana("SE Asia Standard Time");

        private readonly IConfiguration _configuration;

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
        public VisitRegistrationsController(CmsContext context, ILogger<VisitRegistrationsController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
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
        // Có sử dụng endpoint lấy danh sách hợp đồng để truyền vào một ố thông tin của khách hàng
        [HttpPost]
        public async Task<ActionResult<VisitRegistration>> PostVisitRegistration(VisitRegistrationDto visitRegistrationDto)
        {
            //Lấy thông tin thời gian
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var utcNow = DateTime.UtcNow;
            var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);
            var currentDate = localNow.Date;

            // Tạo mã đăng ký thăm viếng theo định dạng DT-yyyyMMdd-xxx
            var registrationsTodayCount = await _context.VisitRegistrations
                .CountAsync(vr => vr.CreatedDate != null && vr.CreatedDate.Value.Date == currentDate);
            var createdDate = registrationsTodayCount > 0
                ? _context.VisitRegistrations
                    .Where(vr => vr.CreatedDate != null && vr.CreatedDate.Value.Date == currentDate)
                    .Select(vr => vr.CreatedDate.Value.Date)
                    .FirstOrDefault()
                : currentDate;
            var registrationCode = $"DT-{createdDate:yyyyMMdd}-{(registrationsTodayCount + 1):D3}";


            // Lấy thông tin StaffId từ token để tự động xác nhận đơn nếu là Staff
            var staffIdClaim = User.FindFirst("StaffId");
            int? approvedBy = null;
            string status = "Pending";

            if (staffIdClaim != null && int.TryParse(staffIdClaim.Value, out int staffId))
            {
                approvedBy = staffId;
                status = "Approved";
            }

           
            // Tạo VisitRegistration mới
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

            // Thêm VisitRegistration vào cơ sở dữ liệu
            _context.VisitRegistrations.Add(visitRegistration);
            await _context.SaveChangesAsync();

            // Trả về thông báo thành công
            return CreatedAtAction(nameof(GetVisitRegistration), new { id = visitRegistration.VisitId }, visitRegistration);
        }


        // DELETE: api/VisitRegistrations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitRegistration(int id)
        {
            var visitRegistration = await _context.VisitRegistrations
                .Include(vr => vr.Customer)  // Include customer to use their email
                .Include(vr => vr.Niche)
                .ThenInclude(n => n.Area)
                .ThenInclude(a => a.Floor)
                .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(vr => vr.VisitId == id);

            if (visitRegistration == null)
            {
                _logger.LogWarning("VisitRegistration not found: {Id}", id); // Log warning
                return NotFound();
            }

            // Update the status to "Canceled"
            visitRegistration.Status = "Canceled";
            _context.Entry(visitRegistration).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                // Send email notification
                SendRejectionEmail(visitRegistration.Customer, visitRegistration);
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

        private void SendRejectionEmail(Customer customer, VisitRegistration visitRegistration)
        {
            var subject = "Thông báo từ chối Đơn đăng ký thăm viếng - Dịch vụ An Bình Viên";
            var messageBody = $@"
            <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                <h2 style='color: #333;'>Kính gửi {customer.FullName},</h2>
                <p>Chúng tôi rất tiếc phải thông báo rằng đơn đăng ký thăm viếng của quý khách đã bị từ chối với mã đơn đăng ký <strong>{visitRegistration.VisitCode}</strong>.</p>

                <p>Quý khách vui lòng liên hệ với chúng tôi qua số điện thoại (+84)999-999-999 hoặc Email info@abv.com để biết thêm chi tiết.</p>

                <p>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng An Bình Viên</p>
                <hr style='border-top: 1px solid #ccc;' />
                <p style='color: #888;'>Email này được gửi từ hệ thống của An Bình Viên. Xin vui lòng không trả lời trực tiếp email này.</p>
            </div>";

            SendEmail(customer.Email, subject, messageBody);
        }



        // PUT: api/VisitRegistrations/approve/5
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveVisitRegistration(int id)
        {
            var visitRegistration = await _context.VisitRegistrations
                .Include(vr => vr.Customer)  // Include customer to use their email
                .Include(vr => vr.Niche)
                .ThenInclude(n => n.Area)
                .ThenInclude(a => a.Floor)
                .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(vr => vr.VisitId == id);

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

                // Send email notification
                SendApprovalEmail(visitRegistration.Customer, visitRegistration);
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

        private void SendApprovalEmail(Customer customer, VisitRegistration visitRegistration)
        {
            var subject = "Thông báo phê duyệt Đơn đăng ký thăm viếng - Dịch vụ An Bình Viên";
            var messageBody = $@"
            <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                <h2 style='color: #333;'>Kính gửi {customer.FullName},</h2>
                <p>Chúng tôi xin thông báo rằng đơn đăng ký thăm viếng của quý khách đã được phê duyệt thành công với các thông tin như sau:</p>

                <h3 style='color: #555;'>Thông tin Đơn đăng ký</h3>
                <ul>
                    <li><strong>Mã đơn đăng ký:</strong> {visitRegistration.VisitCode}</li>
                    <li><strong>Ngày thăm viếng:</strong> {visitRegistration.VisitDate:dd/MM/yyyy}</li>
                    <li><strong>Địa chỉ Ô chứa:</strong> {visitRegistration.Niche.Area.Floor.Building.BuildingName} - {visitRegistration.Niche.Area.Floor.FloorName} - {visitRegistration.Niche.Area.AreaName} - Ô {visitRegistration.Niche.NicheName}</li>
                </ul>

                <p>Nếu có bất kỳ thắc mắc nào, quý khách hàng vui lòng liên hệ với chúng tôi qua số điện thoại (+84)999-999-999 hoặc Email info@abv.com.</p>

                <p>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng An Bình Viên</p>
                <hr style='border-top: 1px solid #ccc;' />
                <p style='color: #888;'>Email này được gửi từ hệ thống của An Bình Viên. Xin vui lòng không trả lời trực tiếp email này.</p>
            </div>";

            SendEmail(customer.Email, subject, messageBody);
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

    }
}
