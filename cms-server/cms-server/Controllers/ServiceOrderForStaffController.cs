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
