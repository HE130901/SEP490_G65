using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using Microsoft.AspNetCore.Authorization;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceOrdersController : ControllerBase
    {
        private readonly CmsContext _context;
private async Task<decimal> CalculateServiceOrderTotalAsync(int serviceOrderId)
        {
            var totalPrice = await _context.ServiceOrderDetails
                .Where(sod => sod.ServiceOrderId == serviceOrderId)
                .Join(_context.Services, sod => sod.ServiceId, s => s.ServiceId,
                      (sod, s) => new { sod.Quantity, s.Price })
                .SumAsync(x => (decimal?)(x.Quantity * x.Price)) ?? 0;

            return totalPrice;
        }
 public ServiceOrdersController(CmsContext context)
        {
            _context = context;
        }
 [HttpGet("customer")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ServiceOrderResponseDto>>> GetServiceOrdersByCustomer()
        {
            var customerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "CustomerId");
            if (customerIdClaim == null)
            {
                return Unauthorized("Customer ID not found in token");
            }
int customerId = int.Parse(customerIdClaim.Value);

            var serviceOrders = await _context.ServiceOrders
                .Include(so => so.ServiceOrderDetails)
                .ThenInclude(sod => sod.Service)
                .Include(so => so.Niche)
                .ThenInclude(n => n.Area)
                .ThenInclude(a => a.Floor)
                .ThenInclude(f => f.Building)
                .Where(so => so.CustomerId == customerId)
                .ToListAsync();
 if (!serviceOrders.Any())
            {
                return NotFound();
            }

            var serviceOrderDtos = serviceOrders.Select(so => new ServiceOrderResponseDto
            {
                ServiceOrderId = so.ServiceOrderId,
                NicheAddress = $"{so.Niche.Area.Floor.Building.BuildingName} - {so.Niche.Area.Floor.FloorName} - {so.Niche.Area.AreaName} - Ô {so.Niche.NicheName}",