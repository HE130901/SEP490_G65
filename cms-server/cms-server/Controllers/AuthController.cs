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



















    }
}
