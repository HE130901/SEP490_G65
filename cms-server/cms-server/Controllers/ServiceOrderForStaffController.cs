using cms_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceOrderForStaffController : ControllerBase
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

        public ServiceOrderForStaffController(CmsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetServiceOrdersList()
        {
            var serviceOrders = await _context.ServiceOrders
            .Include(so => so.ServiceOrderDetails)
                .ThenInclude(sod => sod.Service)
            .ToListAsync();

            var serviceOrderResponses = new List<ServiceOrderResponse>();

            foreach (var serviceOrder in serviceOrders)
            {
                var totalPrice = await CalculateServiceOrderTotalAsync(serviceOrder.ServiceOrderId);

                var response = new ServiceOrderResponse
                {
                    ServiceOrderCode = serviceOrder.ServiceOrderCode,
                    ServiceOrderDetails = (List<ServiceOrderDetail>)serviceOrder.ServiceOrderDetails,
                    TotalPrice = totalPrice
                };

                serviceOrderResponses.Add(response);
            }

            return Ok(serviceOrderResponses);
        }

        // Endpoint to get the details of a specific service order
        [HttpGet("{serviceOrderId}")]
        public async Task<IActionResult> GetServiceOrderDetails(int serviceOrderId)
        {
            var serviceOrder = await _context.ServiceOrders
            .Include(so => so.Customer)
            .Include(so => so.Niche)
                .ThenInclude(n => n.Area)
                .ThenInclude(a => a.Floor)
                .ThenInclude(f => f.Building)
             .Include(so => so.ServiceOrderDetails)
                .ThenInclude(sod => sod.Service)
            .FirstOrDefaultAsync(so => so.ServiceOrderId == serviceOrderId);

            if (serviceOrder == null)
            {
                return NotFound();
            }

            var totalPrice = await CalculateServiceOrderTotalAsync(serviceOrder.ServiceOrderId);

            var response = new ServiceOrderDetailsResponse
            {
                ServiceOrderCode = serviceOrder.ServiceOrderCode,
                CustomerFullName = serviceOrder.Customer.FullName,
                Niche = new NicheInfo
                {
                    Building = serviceOrder.Niche.Area.Floor.Building.BuildingName,
                    Floor = serviceOrder.Niche.Area.Floor.FloorName,
                    Area = serviceOrder.Niche.Area.AreaName,
                    NicheName = serviceOrder.Niche.NicheName
                },

                ServiceOrderDetails = (List<ServiceOrderDetail>)serviceOrder.ServiceOrderDetails,
                TotalPrice = totalPrice
            };

            return Ok(response);
        }

        // Endpoint to update the CompletionImage and set status to "Complete"
        [HttpPut("update-completion-image")]
        public async Task<IActionResult> UpdateCompletionImage([FromBody] UpdateCompletionImageRequest request)
        {
            // Extract StaffID from the JWT token
            var staffId = GetStaffIdFromToken();

            var serviceOrderDetail = await _context.ServiceOrderDetails.FindAsync(request.ServiceOrderDetailID);

            var serviceOrder = await _context.ServiceOrders.FindAsync(serviceOrderDetail.ServiceOrderId);

            serviceOrderDetail.CompletionImage = request.CompletionImage;
            serviceOrderDetail.Status = "Complete";

            serviceOrder.StaffId = staffId;  // Update StaffID in ServiceOrder

            _context.ServiceOrderDetails.Update(serviceOrderDetail);
            _context.ServiceOrders.Update(serviceOrder);
            await _context.SaveChangesAsync();

            // Create and save the notification
            var notification = new Notification
            {
                CustomerId = serviceOrder.CustomerId,
                StaffId = staffId,
                ServiceOrderId = serviceOrder.ServiceOrderId,
                NotificationDate = DateTime.Now,
                Message = "Your service order has been updated with a completion image."
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(serviceOrderDetail);
        }

        [HttpPost("create-service-order")]
        public async Task<IActionResult> CreateServiceOrder([FromBody] CreateServiceOrderRequest request)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var customer = await _context.Customers.FindAsync(request.CustomerID);
                    if (customer == null)
                    {
                        return NotFound("Customer not found.");
                    }

                    var niche = await _context.Niches.FindAsync(request.NicheID);
                    if (niche == null || niche.CustomerId != customer.CustomerId)
                    {
                        return BadRequest("Niche not found or does not belong to the customer.");
                    }

                    var serviceOrder = new ServiceOrder
                    {
                        CustomerId = request.CustomerID,
                        NicheId = request.NicheID,
                        OrderDate = DateTime.Now
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

        [HttpPost("add-service-to-order")]
        public async Task<IActionResult> AddServiceToOrder([FromBody] AddServiceToOrderRequest request)
        {
            var serviceOrder = await _context.ServiceOrders.FindAsync(request.ServiceOrderID);
            if (serviceOrder == null)
            {
                return NotFound("Service order not found.");
            }

            foreach (var detail in request.ServiceOrderDetails)
            {
                var serviceOrderDetail = new ServiceOrderDetail
                {
                    ServiceOrderId = request.ServiceOrderID,
                    ServiceId = detail.ServiceID,
                    Quantity = detail.Quantity,
                    Status = "Pending"
                };
                _context.ServiceOrderDetails.Add(serviceOrderDetail);
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("remove-service-from-order/{serviceOrderDetailId}")]
        public async Task<IActionResult> RemoveServiceFromOrder(int serviceOrderDetailId)
        {
            var serviceOrderDetail = await _context.ServiceOrderDetails.FindAsync(serviceOrderDetailId);
            if (serviceOrderDetail == null)
            {
                return NotFound("Service order detail not found.");
            }

            _context.ServiceOrderDetails.Remove(serviceOrderDetail);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // Endpoint to cancel a service order
        [HttpPut("cancel-service-order/{serviceOrderId}")]
        public async Task<IActionResult> CancelServiceOrder(int serviceOrderId)
        {
            var serviceOrder = await _context.ServiceOrders
            .Include(so => so.ServiceOrderDetails)
            .FirstOrDefaultAsync(so => so.ServiceOrderId == serviceOrderId);

            if (serviceOrder == null)
            {
                return NotFound("Service order not found.");
            }

            foreach (var serviceOrderDetail in serviceOrder.ServiceOrderDetails)
            {
                serviceOrderDetail.Status = "Cancled";
                _context.ServiceOrderDetails.Update(serviceOrderDetail);
            }

            await _context.SaveChangesAsync();

            return Ok(serviceOrder);
        }
    }


    public class ServiceOrderResponse
    {
        public string ServiceOrderCode { get; set; }
        public List<ServiceOrderDetail> ServiceOrderDetails { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class ServiceOrderDetailsResponse
    {
        public string ServiceOrderCode { get; set; }
        public string CustomerFullName { get; set; }
        public NicheInfo Niche { get; set; }
        public decimal TotalPrice { get; set; }
        public List<ServiceOrderDetail> ServiceOrderDetails { get; set; }
    }

    public class NicheInfo
    {
        public string Building { get; set; }
        public string Floor { get; set; }
        public string Area { get; set; }
        public string NicheName { get; set; }
    }

    public class UpdateCompletionImageRequest
    {
        public int ServiceOrderDetailID { get; set; }
        public string CompletionImage { get; set; }

    }

    public class CreateServiceOrderRequest
    {
        public int CustomerID { get; set; }
        public int NicheID { get; set; }
        public List<ServiceOrderDetailRequest> ServiceOrderDetails { get; set; }
    }

    public class ServiceOrderDetailRequest
    {
        public int ServiceID { get; set; }
        public int Quantity { get; set; }
    }

    public class AddServiceToOrderRequest
    {
        public int ServiceOrderID { get; set; }
        public List<ServiceOrderDetailRequest> ServiceOrderDetails { get; set; }
    }
}
