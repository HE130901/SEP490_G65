using cms_server.Configuration;
using cms_server.Models;
using cms_server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit.Text;
using MimeKit;
using System.Security.Claims;
using TimeZoneConverter;
using Castle.Core.Resource;
using MailKit.Net.Smtp;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceOrderForStaffController : ControllerBase
    {
        private readonly CmsContext _context;

        private readonly string timeZoneId = TZConvert.WindowsToIana("SE Asia Standard Time");

        private readonly IConfiguration _configuration;

        private void SendEmail(string recipientEmail, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(
                _configuration["SmtpSettings:SenderName"],
                _configuration["SmtpSettings:SenderEmail"]));
            emailMessage.To.Add(new MailboxAddress(recipientEmail, recipientEmail));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(TextFormat.Html) { Text = message };

            using (var client = new SmtpClient())
            {
                client.Connect(
                    _configuration["SmtpSettings:Server"],
                    int.Parse(_configuration["SmtpSettings:Port"]),
                    MailKit.Security.SecureSocketOptions.StartTls);
                client.Authenticate(
                    _configuration["SmtpSettings:Username"],
                    _configuration["SmtpSettings:Password"]);
                client.Send(emailMessage);
                client.Disconnect(true);
            }
        }

        public ServiceOrderForStaffController(CmsContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

            var serviceOrderDetail = await _context.ServiceOrderDetails
                .Include(sod => sod.ServiceOrder)
                .ThenInclude(so => so.Customer)
                .FirstOrDefaultAsync(sod => sod.ServiceOrderDetailId == request.ServiceOrderDetailID);

            if (serviceOrderDetail == null)
            {
                return NotFound("Service order detail not found.");
            }

            var serviceOrder = serviceOrderDetail.ServiceOrder;
            if (serviceOrder == null)
            {
                return NotFound("Service order not found.");
            }

            var customer = serviceOrder.Customer;
            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            // Update service order detail
            serviceOrderDetail.CompletionImage = request.CompletionImage;
            serviceOrderDetail.Status = "Completed";
            serviceOrder.StaffId = staffId;

            _context.ServiceOrderDetails.Update(serviceOrderDetail);
            _context.ServiceOrders.Update(serviceOrder);
            await _context.SaveChangesAsync();

            // Prepare email content
            var nicheAddress = await GetNicheAddress(serviceOrder.NicheId);
            var totalPrice = await CalculateServiceOrderTotalAsync(serviceOrder.ServiceOrderId);

            var subject = "Xác nhận hoàn thành dịch vụ - Hệ thống quản lý An Bình Viên";
            var message = $@"
                            <p>Kính gửi <strong>{customer.FullName}</strong>,</p>
                            <p>Đơn đặt dịch vụ của bạn với mã đơn <strong>{serviceOrder.ServiceOrderCode}</strong> đã được hoàn thành.</p>
                            <p><strong>Thông tin đơn hàng:</strong></p>
                            <ul>
                                <li><strong>Khách hàng:</strong> {customer.FullName}</li>
                                <li><strong>Ngày tạo:</strong> {serviceOrder.CreatedDate?.ToString("HH:mm dd/MM/yyyy")}</li>
                                <li><strong>Ngày hẹn:</strong> {serviceOrder.OrderDate?.ToString("HH:mm dd/MM/yyyy")}</li>
                                <li><strong>Vị trí Ô chứa:</strong> {nicheAddress}</li>
                                <li><strong>Tổng số tiền:</strong> {totalPrice}₫</li>
                            </ul>
                            <p><strong>Chi tiết dịch vụ:</strong></p>
                            <ul>
                                {string.Join("", serviceOrder.ServiceOrderDetails.Select(detail => $@"
                                    <li>
                                        <strong>Dịch vụ:</strong> {detail.Service?.ServiceName ?? "N/A"} - <strong>Số lượng:</strong> {detail.Quantity}
                                        {(string.IsNullOrEmpty(detail.CompletionImage) ? "" : $"<br/><img src=\"{detail.CompletionImage}\" alt=\"Completion Image\" style=\"max-width: 100%; height: auto;\"/>")}
                                    </li>"))}
                            </ul>
                            <p>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng</p>";

            SendEmail(customer.Email, subject, message);

            return Ok(serviceOrderDetail);
        }




        [HttpPost("create-service-order")]
        public async Task<IActionResult> CreateServiceOrder([FromBody] CreateServiceOrderRequest request)
        {
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var utcNow = DateTime.UtcNow;
            var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);

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
                        CreatedDate = localNow,
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

    }

    // DTO and Request classes
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
        public DateTime? CreatedDate { get; set; }
        public DateTime? OrderDate { get; set; }
        public NicheInfo Niche { get; set; }
        public decimal TotalPrice { get; set; }
        public List<ServiceOrderDetail> ServiceOrderDetails { get; set; }
        public string FormattedCreatedDate => CreatedDate?.ToString("HH:mm dd/MM/yyyy");
        public string FormattedOrderDate => OrderDate?.ToString("HH:mm dd/MM/yyyy");
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
        public DateTime OrderDate { get; set; }
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

    public class ServiceOrderForStaffDto
    {
        public int ServiceOrderId { get; set; }
        public string ServiceOrderCode { get; set; }
        public List<ServiceOrderDetailDto> ServiceOrderDetails { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? OrderDate { get; set; }
        public string FormattedCreatedDate => CreatedDate?.ToString("HH:mm dd/MM/yyyy");
        public string FormattedOrderDate => OrderDate?.ToString("HH:mm dd/MM/yyyy");
    }

    public class ServiceOrderDetailDto
    {
        public int ServiceOrderDetailId { get; set; }
        public int ServiceOrderId { get; set; }
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public string? CompletionImage { get; set; }
    }

    public class ServiceOrderResponseDto1
    {
        public int ServiceOrderId { get; set; }
        public string NicheAddress { get; set; }
        public string CustomerName { get; set; }
        public string ServiceOrderCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? OrderDate { get; set; }
        public List<ServiceOrderDetailDto> ServiceOrderDetails { get; set; }
        public string FormattedCreatedDate => CreatedDate?.ToString("HH:mm dd/MM/yyyy");
        public string FormattedOrderDate => OrderDate?.ToString("HH:mm dd/MM/yyyy");
    }
}
