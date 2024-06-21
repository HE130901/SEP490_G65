using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using cms_server.DTOs;
using cms_server.Models;
using System.Text;
using System.Security.Cryptography;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using Microsoft.Extensions.Configuration;

namespace CMSApi.Controllers
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

        [HttpPost("login")]
        public IActionResult Login(LoginDto loginDto)
        {
            var customer = _context.Customers.SingleOrDefault(c => c.Email == loginDto.Email);
            if (customer != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.PasswordHash))
            {
                var token = GenerateJwtToken(customer.CustomerId.ToString(), customer.AccountStatus, customer.Phone, customer.Address);
                return Ok(new
                {
                    Token = token,
                    Role = customer.AccountStatus
                });
            }

            return Unauthorized("Invalid credentials.");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (_context.Customers.Any(c => c.Email == registerDto.Email))
                return BadRequest("Email already in use.");

            var customer = new Customer
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                Phone = registerDto.Phone,
                Address = registerDto.Address,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CitizenId = registerDto.CitizenId,
                AccountStatus = "Guest"
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok("Registration successful.");
        }

        [HttpGet("get-current-user")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
            {
                return Unauthorized("Invalid token.");
            }

            if (role == "Customer" || role == "Guest")
            {
                if (int.TryParse(userId, out int parsedUserId))
                {
                    var customer = _context.Customers.SingleOrDefault(c => c.CustomerId == parsedUserId);
                    if (customer == null)
                    {
                        return NotFound("Customer not found.");
                    }

                    return Ok(new
                    {
                        customerId = customer.CustomerId,
                        fullName = customer.FullName,
                        citizenId = customer.CitizenId,
                        role = customer.AccountStatus,
                        email = customer.Email,
                        phone = customer.Phone,
                        address = customer.Address
                    });
                }
            }

            return Unauthorized("Invalid user role.");
        }

        [HttpPost("request-password-reset")]
        public IActionResult RequestPasswordReset(RequestPasswordResetDto requestDto)
        {
            var customer = _context.Customers.SingleOrDefault(c => c.Email == requestDto.Email);
            if (customer == null)
            {
                return NotFound("Email not found.");
            }

            var newPassword = GenerateRandomPassword();
            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            _context.SaveChanges();

            var message = $"Your new password is: {newPassword}";

            SendEmail(customer.Email, "Your New Password", message);

            return Ok("A new password has been sent to your email.");
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordDto resetDto)
        {
            var customer = _context.Customers.SingleOrDefault(c => c.PasswordResetToken == resetDto.Token);
            if (customer == null || customer.PasswordResetTokenExpiration < DateTime.UtcNow)
            {
                return BadRequest("Invalid or expired token.");
            }

            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetDto.NewPassword);
            customer.PasswordResetToken = null;
            customer.PasswordResetTokenExpiration = null;
            _context.SaveChanges();

            return Ok("Password reset successful.");
        }

        private string GenerateJwtToken(string userId, string role, string phone, string address)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role),
                new Claim("Phone", phone),
                new Claim("Address", address)
            };

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

namespace cms_server.DTOs
{
    public class RequestPasswordResetDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
