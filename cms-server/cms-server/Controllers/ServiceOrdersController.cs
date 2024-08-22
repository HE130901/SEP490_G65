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
using cms_server.DTOs;

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

        private string getDeceasedName(int? deceasedId)
        {
            var deceased = _context.Deceaseds.Find(deceasedId);
            if (deceased == null)
            {
                return "Không xác định";
            }
            return deceased.FullName;
        }

        private string getStaffName(int? staffId)
        {
            var staff = _context.Staff.Find(staffId);
            if (staff == null)
            {
                return "Không xác định";
            }
            return staff.FullName;
        }





        private decimal getServicePrice(int serviceId)
        {
            var service = _context.Services.Find(serviceId);
            if (service == null)
            {
                return 0;
            }
            return (decimal)service.Price;
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
                DeceasedName = getDeceasedName(so.Niche.DeceasedId),
                NicheAddress = $"{so.Niche.Area.Floor.Building.BuildingName} - {so.Niche.Area.Floor.FloorName} - {so.Niche.Area.AreaName} - Ô {so.Niche.NicheName}",
                CreatedDate = so.CreatedDate,
                OrderDate = so.OrderDate,
                ServiceOrderCode = so.ServiceOrderCode,
                CompletedBy = getStaffName(so.StaffId),
                CompletedDate = so.CompletedDate,
                ServiceOrderDetails = so.ServiceOrderDetails.Select(sod => new ServiceOrderDetailResponseDto
                {
                    ServiceName = sod.Service.ServiceName,
                    Quantity = sod.Quantity,
                    Price = getServicePrice(sod.ServiceId),
                    CompletionImage = sod.CompletionImage,
                    Status = sod.Status
                }).ToList()
            }).ToList();

            return Ok(serviceOrderDtos);
        }

        [HttpPost("create-service-order")]
        [Authorize]
        public async Task<IActionResult> CreateServiceOrder([FromBody] CreateServiceOrderRequest request)
        {
            var customerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "CustomerId");
            if (customerIdClaim == null)
            {
                return Unauthorized("Customer ID not found in token");
            }

            int customerId = int.Parse(customerIdClaim.Value);

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var customer = await _context.Customers.FindAsync(customerId);
                    if (customer == null)
                    {
                        return NotFound("Customer not found.");
                    }

                    var niche = await _context.Niches.FindAsync(request.NicheID);
                    if (niche == null || niche.CustomerId != customer.CustomerId)
                    {
                        return BadRequest("Niche not found or does not belong to the customer.");
                    }

                    // Đếm số lượng đơn hàng trong ngày hiện tại để tạo mã ServiceOrderCode
                    var currentDate = DateTime.Now.Date;
                    var ordersTodayCount = await _context.ServiceOrders
                        .CountAsync(so => so.CreatedDate != null && so.CreatedDate.Value.Date == currentDate);

                    var serviceOrderCode = $"DV-{currentDate:yyyyMMdd}-{(ordersTodayCount + 1):D3}";

                    var serviceOrder = new ServiceOrder
                    {
                        CustomerId = customerId,
                        NicheId = request.NicheID,
                        CreatedDate = DateTime.Now,
                        OrderDate = request.OrderDate,
                        ServiceOrderCode = serviceOrderCode 
                    };
                    _context.ServiceOrders.Add(serviceOrder);
                    await _context.SaveChangesAsync();

                    foreach (var detail in request.ServiceOrderDetails)
                    {
                        var serviceOrderDetail = new ServiceOrderDetail
                        {
                            ServiceOrderId = serviceOrder.ServiceOrderId,
                            ServiceId = detail.ServiceID,
                            Quantity = detail.Quantity,
                            Status = "Pending"
                        };
                        _context.ServiceOrderDetails.Add(serviceOrderDetail);
                    }
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    // Calculate the total price
                    var totalPrice = await CalculateServiceOrderTotalAsync(serviceOrder.ServiceOrderId);

                    return Ok(new
                    {
                        ServiceOrder = serviceOrder,
                        TotalPrice = totalPrice
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, ex.Message);
                }
            }
        }




        // PUT: api/ServiceOrders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServiceOrder(int id, UpdateServiceOrderRequest request)
        {
            if (id != request.ServiceOrderId)
            {
                return BadRequest();
            }

            var serviceOrder = await _context.ServiceOrders.FindAsync(id);
            if (serviceOrder == null)
            {
                return NotFound();
            }

            serviceOrder.OrderDate = request.OrderDate;

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


        private bool ServiceOrderExists(int id)
        {
            return _context.ServiceOrders.Any(e => e.ServiceOrderId == id);
        }
    }

}
