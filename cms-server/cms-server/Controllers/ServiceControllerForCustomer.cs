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
                        OrderDate = DateTime.Now,
                        StaffId = request.StaffID
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
                            CompletionImage = detail.CompletionImage,
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
    }

    public class CreateServiceOrderRequest
    {
        public int CustomerID { get; set; }
        public int NicheID { get; set; }
        public int StaffID { get; set; }
        public List<ServiceOrderDetailRequest> ServiceOrderDetails { get; set; }
    }

    public class ServiceOrderDetailRequest
    {
        public int ServiceID { get; set; }
        public int Quantity { get; set; }
        public string CompletionImage { get; set; }
        public string Status { get; set; }
    }
}
