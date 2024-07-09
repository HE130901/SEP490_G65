using cms_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceControllerForCustomer : ControllerBase
    {

        private readonly CmsContext _context;

        public ServiceControllerForCustomer(CmsContext context)
        {
            _context = context;
        }

        [HttpGet("services")]
        public async Task<IActionResult> GetServicesList()
        {
            var services = await _context.Services.ToListAsync();
            return Ok(services);
        }

        [HttpPost("order")]
        public async Task<IActionResult> PlaceServiceOrder([FromBody] CreateServiceOrderRequest request)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
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
                    return Ok(serviceOrder);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    var innerExceptionMessage = ex.InnerException?.Message;
                    var detailedErrorMessage = $"Error: {ex.Message}, Inner Exception: {innerExceptionMessage}";
                    return StatusCode(500, detailedErrorMessage);
                }
            }
        }

        [HttpGet("{customerId}/niche/{nicheId}")]
        public async Task<IActionResult> GetServiceOrders(int customerId, int nicheId)
        {
            var serviceOrders = await _context.ServiceOrders
                .Where(so => so.CustomerId == customerId && so.NicheId == nicheId)
                .Include(so => so.ServiceOrderDetails)
                .ThenInclude(sod => sod.Service)
                .ToListAsync();

            return Ok(serviceOrders);
        }

        [HttpPost("add-service")]
        public async Task<IActionResult> AddServiceToOrder([FromBody] AddServiceToOrderRequest request)
        {
            var serviceOrderDetail = new ServiceOrderDetail
            {
                ServiceOrderId = request.ServiceOrderID,
                ServiceId = request.ServiceID,
                Quantity = request.Quantity,
                Status = "Pending"
            };

            _context.ServiceOrderDetails.Add(serviceOrderDetail);
            await _context.SaveChangesAsync();

            return Ok(serviceOrderDetail);
        }

        [HttpDelete("remove-service/{serviceOrderDetailId}")]
        public async Task<IActionResult> RemoveServiceFromOrder(int serviceOrderDetailId)
        {
            var serviceOrderDetail = await _context.ServiceOrderDetails.FindAsync(serviceOrderDetailId);
            if (serviceOrderDetail == null)
            {
                return NotFound();
            }

            _context.ServiceOrderDetails.Remove(serviceOrderDetail);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("update-order-date")]
        public async Task<IActionResult> UpdateOrderDate([FromBody] UpdateOrderDateRequest request)
        {
            var serviceOrder = await _context.ServiceOrders.FindAsync(request.ServiceOrderID);
            if (serviceOrder == null)
            {
                return NotFound();
            }

            serviceOrder.OrderDate = request.OrderDate;
            await _context.SaveChangesAsync();

            return Ok(serviceOrder);
        }

        // Endpoint to update the quantity of a service in an existing service order
        [HttpPut("update-service-quantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateServiceQuantityRequest request)
        {
            var serviceOrderDetail = await _context.ServiceOrderDetails.FindAsync(request.ServiceOrderDetailID);
            if (serviceOrderDetail == null)
            {
                return NotFound();
            }

            serviceOrderDetail.Quantity = request.Quantity;
            await _context.SaveChangesAsync();

            return Ok(serviceOrderDetail);
        }
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
        public string Status { get; set; }
    }

    public class AddServiceToOrderRequest
    {
        public int ServiceOrderID { get; set; }
        public int ServiceID { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateOrderDateRequest
    {
        public int ServiceOrderID { get; set; }
        public DateTime OrderDate { get; set; }
    }

    public class UpdateServiceQuantityRequest
    {
        public int ServiceOrderDetailID { get; set; }
        public int Quantity { get; set; }
    }
}
