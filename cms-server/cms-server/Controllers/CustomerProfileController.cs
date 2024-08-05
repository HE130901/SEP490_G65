using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerProfileController : ControllerBase
    {
        private readonly CmsContext _context;

        public CustomerProfileController(CmsContext context)
        {
            _context = context;
        }

        // GET: api/CustomerProfile
        [HttpGet]
        public async Task<ActionResult<CustomerDto1>> GetCurrentCustomer()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("User ID is missing.");
            }

            if (!int.TryParse(userId, out int customerId))
            {
                return BadRequest("Invalid User ID.");
            }

            // Get the current customer's profile
            var customer = await _context.Customers
                .Where(c => c.CustomerId == customerId)
                .Select(c => new CustomerDto1
                {
                    CustomerId = c.CustomerId,
                    FullName = c.FullName,
                    Email = c.Email,
                    Phone = c.Phone,
                    Address = c.Address,
                    CitizenId = c.CitizenId,
                    CitizenIdissuanceDate = c.CitizenIdissuanceDate,
                    CitizenIdsupplier = c.CitizenIdsupplier,
                })
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            return Ok(customer);
        }


    }
}