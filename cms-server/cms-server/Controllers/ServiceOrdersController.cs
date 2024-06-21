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
    public class ServiceOrdersController : ControllerBase
    {
        private readonly CmsContext _context;

        public ServiceOrdersController(CmsContext context)
        {
            _context = context;
        }

        // GET: api/ServiceOrders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceOrder>>> GetServiceOrders()
        {
            return await _context.ServiceOrders.ToListAsync();
        }

        // GET: api/ServiceOrders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceOrder>> GetServiceOrder(int id)
        {
            var serviceOrder = await _context.ServiceOrders.FindAsync(id);

            if (serviceOrder == null)
            {
                return NotFound();
            }

            return serviceOrder;
        }

        // GET: api/ServiceOrders/customer/5
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<ServiceOrder>>> GetServiceOrdersByCustomer(int customerId)
        {
            var serviceOrders = await _context.ServiceOrders
                .Where(so => so.CustomerId == customerId)
                .ToListAsync();

            if (serviceOrders == null || !serviceOrders.Any())
            {
                return NotFound();
            }

            return serviceOrders;
        }

        // PUT: api/ServiceOrders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServiceOrder(int id, ServiceOrder serviceOrder)
        {
            if (id != serviceOrder.ServiceOrderId)
            {
                return BadRequest();
            }

            _context.Entry(serviceOrder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceOrderExists(id))
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

        // POST: api/ServiceOrders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ServiceOrder>> PostServiceOrder(ServiceOrderDto serviceOrderDto)
        {
            var serviceOrder = new ServiceOrder
            {
                CustomerId = serviceOrderDto.CustomerId,
                NicheId = serviceOrderDto.NicheId,
                ServiceList = serviceOrderDto.ServiceList,
                OrderDate = DateTime.UtcNow, // Set order date to current date
                Status = "Pending", // Set status to pending
                CompletionImage = null, // Set image to null
                StaffId = null // Set staffId to null
            };

            _context.ServiceOrders.Add(serviceOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServiceOrder", new { id = serviceOrder.ServiceOrderId }, serviceOrder);
        }

        // DELETE: api/ServiceOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceOrder(int id)
        {
            var serviceOrder = await _context.ServiceOrders.FindAsync(id);
            if (serviceOrder == null)
            {
                return NotFound();
            }

            _context.ServiceOrders.Remove(serviceOrder);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceOrderExists(int id)
        {
            return _context.ServiceOrders.Any(e => e.ServiceOrderId == id);
        }
    }

    public class ServiceOrderDto
    {
        public int CustomerId { get; set; }
        public int NicheId { get; set; }
        public string? ServiceList { get; set; }
    }
}
