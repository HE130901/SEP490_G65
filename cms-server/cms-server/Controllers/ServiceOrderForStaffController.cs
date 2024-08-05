using cms_server.Configuration;
using cms_server.Models;
using cms_server.Services;
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
        //private readonly INotificationService _notificationService;
// public ServiceOrderForStaffController(CmsContext context, INotificationService notificationService)
        public ServiceOrderForStaffController(CmsContext context)
        {
            _context = context;
          //  _notificationService = notificationService;
        }
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
  private async Task<string> GetNicheAddress(int nicheId)
        {
            var niche = await _context.Niches
                .Include(n => n.Area)
                    .ThenInclude(a => a.Floor)
                        .ThenInclude(f => f.Building)
                .FirstOrDefaultAsync(n => n.NicheId == nicheId);

            if (niche == null) return string.Empty;

            return $"{niche.Area.Floor.Building.BuildingName} - {niche.Area.Floor.FloorName} - {niche.Area.AreaName} - Ô {niche.NicheName}";
        }

        [HttpGet]
        public async Task<IActionResult> GetServiceOrdersList()
        {
            var serviceOrders = await _context.ServiceOrders
                .Include(so => so.ServiceOrderDetails)
                    .ThenInclude(sod => sod.Service)
                .Include(so => so.Customer)
                .ToListAsync();

            var serviceOrderResponses = new List<ServiceOrderResponseDto1>();

            foreach (var serviceOrder in serviceOrders)
            {
                var nicheAddress = await GetNicheAddress(serviceOrder.NicheId);

                var response = new ServiceOrderResponseDto1
                {
                    ServiceOrderId = serviceOrder.ServiceOrderId,
                    NicheAddress = nicheAddress,
                    CustomerName = serviceOrder.Customer.FullName,
                    CreatedDate = serviceOrder.CreatedDate,
                    OrderDate = serviceOrder.OrderDate,
                    ServiceOrderCode = serviceOrder.ServiceOrderCode,
                    ServiceOrderDetails = serviceOrder.ServiceOrderDetails.Select(detail => new ServiceOrderDetailDto
                    {
                        ServiceName = detail.Service.ServiceName,
                        Quantity = detail.Quantity,
                        Status = detail.Status,
                        CompletionImage = detail.CompletionImage
                    }).ToList()
                };

                serviceOrderResponses.Add(response);
            }

            return Ok(serviceOrderResponses);
        }
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
                OrderDate = serviceOrder.OrderDate,
                CreatedDate = serviceOrder.CreatedDate,
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

        [HttpPut("update-completion-image")]
        public async Task<IActionResult> UpdateCompletionImage([FromBody] UpdateCompletionImageRequest request)
        {
            var staffId = GetStaffIdFromToken();

            var serviceOrderDetail = await _context.ServiceOrderDetails.FindAsync(request.ServiceOrderDetailID);

            if (serviceOrderDetail == null)
            {
                return NotFound("Service order detail not found.");
            }

            var serviceOrder = await _context.ServiceOrders.FindAsync(serviceOrderDetail.ServiceOrderId);

            if (serviceOrder == null)
            {
                return NotFound("Service order not found.");
            }

            serviceOrderDetail.CompletionImage = request.CompletionImage;
            serviceOrderDetail.Status = "Completed";
            serviceOrder.StaffId = staffId;

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
                Message = $"Your service order detail for {serviceOrderDetail.ServiceOrderDetailId} has been updated with a completion image."
            };

            //await _notificationService.SendNotificationAsync(notification);

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

                    // Đếm số lượng đơn hàng trong ngày hiện tại để tạo mã ServiceOrderCode
                    var currentDate = DateTime.Now.Date;
                    var ordersTodayCount = await _context.ServiceOrders
                        .CountAsync(so => so.CreatedDate != null && so.CreatedDate.Value.Date == currentDate);

                    var serviceOrderCode = $"DV-{currentDate:yyyyMMdd}-{(ordersTodayCount + 1):D3}";

                    var serviceOrder = new ServiceOrder
                    {
                        CustomerId = request.CustomerID,
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

