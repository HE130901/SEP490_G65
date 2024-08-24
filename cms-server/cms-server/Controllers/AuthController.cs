using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using cms_server.DTOs;
using System.Text;
using MimeKit;
using MailKit.Net.Smtp;
using MimeKit.Text;
using Microsoft.Extensions.Configuration;
using Castle.Core.Resource;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(CmsContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        // POST: /api/auth/register
        [HttpPost("login")]
        public IActionResult Login(LoginDto loginDto)
        {
            var customer = _context.Customers.SingleOrDefault(c => c.Email == loginDto.Email);

            // Check if the user exists and the password is correct
            if (customer != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.PasswordHash))
            {
                var token = GenerateJwtToken(customer.CustomerId.ToString(), "Customer", customer.Phone, customer.Address);
                return Ok(new
                {
                    Token = token,
                    Role = "Customer"
                });
            }

            var staff = _context.Staff.SingleOrDefault(s => s.Email == loginDto.Email);

            // Check if the user exists and the password is correct
            if (staff != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, staff.PasswordHash))
            {
                var token = GenerateJwtToken(staff.StaffId.ToString(), staff.Role, staff.Phone, staff.Email);
                return Ok(new
                {
                    Token = token,
                    Id = staff.StaffId,
                    Name = staff.FullName,
                    Email = staff.Email,
                    Role = staff.Role
                });
            }

            return Unauthorized("Invalid credentials.");
        }


        // POST: /api/auth/get-current-user
        [HttpGet("get-current-user")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // return user info based on the role
            if (int.TryParse(userId, out int parsedUserId))
            {
                var customer = _context.Customers.SingleOrDefault(c => c.CustomerId == parsedUserId);
                if (customer != null)
                {
                    return Ok(new
                    {
                        customerId = customer.CustomerId,
                        fullName = customer.FullName,
                        citizenId = customer.CitizenId,
                        email = customer.Email,
                        phone = customer.Phone,
                        address = customer.Address
                    });
                }

                var staff = _context.Staff.SingleOrDefault(s => s.StaffId == parsedUserId);
                if (staff != null)
                {
                    return Ok(new
                    {
                        staffId = staff.StaffId,
                        fullName = staff.FullName,
                        email = staff.Email,
                        phone = staff.Phone,
                        role = staff.Role
                    });
                }
            }

            return Unauthorized("Invalid user role.");
        }

        // POST: /api/auth/request-password-reset
        [HttpPost("request-password-reset")]
        public IActionResult RequestPasswordReset(RequestPasswordResetDto requestDto)
        {
            // Tìm khách hàng hoặc nhân viên theo email
            var customer = _context.Customers.SingleOrDefault(c => c.Email == requestDto.Email);

            // Check là nhân viên
            if (customer == null)
            {
                var staff = _context.Staff.SingleOrDefault(s => s.Email == requestDto.Email);
                if (staff == null)
                {
                    //Nếu không tìm thấy email
                    return NotFound("Email not found.");
                }

                // Tạo mật khẩu mới và lưu vào cơ sở dữ liệu
                var newPassword = GenerateRandomPassword();
                staff.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
                _context.SaveChanges();

                // Gửi email chứa mật khẩu mới
                var message = $"Mật khẩu mới của bạn là: {newPassword}";
                SendEmail(staff.Email, "Đặt lại mật khẩu", message);

                // Trả về thông báo
                return Ok("Mật khẩu mới đã được gửi tới email của bạn.");
            }
            // Check là khách hàng
            else
            {
                // Tạo mật khẩu mới và lưu vào cơ sở dữ liệu
                var newPassword = GenerateRandomPassword();
                customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
                _context.SaveChanges();

                // Gửi email chứa mật khẩu mới
                var message = $"Mật khẩu mới của bạn là: {newPassword}";
                SendEmail(customer.Email, "Đặt lại mật khẩu", message);

                //trả về thông báo
                return Ok("Mật khẩu mới đã được gửi tới email của bạn.");
            }
        }



        // POST: /api/auth/change-password
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // change password based on the role
            if (int.TryParse(userId, out int customerId))
            {
                var customer = await _context.Customers.FindAsync(customerId);

                if (customer == null)
                {
                    return NotFound("Customer not found.");
                }

                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.OldPassword, customer.PasswordHash))
                {
                    return BadRequest("Old password is incorrect.");
                }

                customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            return Unauthorized("Invalid user role.");
        }


        
        private string GenerateJwtToken(string userId, string role, string phone, string address = null)
        {
            var claims = new List<Claim>
             {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim("Phone", phone),
            new Claim(ClaimTypes.Role, role)
             };

            if (role == "Customer")
            {
                claims.Add(new Claim("CustomerId", userId)); 
            }
            else if (role == "Staff")
            {
                claims.Add(new Claim("StaffId", userId));
            }

            if (address != null)
            {
                claims.Add(new Claim("Address", address));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private string GenerateRandomPassword(int length = 12)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
            var random = new Random();
            return new string(Enumerable.Repeat(validChars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private void SendEmail(string recipientEmail, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(
                _configuration["SmtpSettings:SenderName"],
                _configuration["SmtpSettings:SenderEmail"]));
            emailMessage.To.Add(new MailboxAddress(recipientEmail, recipientEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(TextFormat.Html) { Text = message };

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
