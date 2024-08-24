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
using cms_server.DTOs;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceOrderForStaffController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly string timeZoneId = TZConvert.WindowsToIana("SE Asia Standard Time");
        private readonly IConfiguration _configuration;

        public ServiceOrderForStaffController(CmsContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        //Hàm gửi email
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


        //Hàm tính tổng giá trị của đơn hàng dịch vụ
        private async Task<decimal> CalculateServiceOrderTotalAsync(int serviceOrderId)
        {
            var totalPrice = await _context.ServiceOrderDetails
                .Where(sod => sod.ServiceOrderId == serviceOrderId)
                .Join(_context.Services, sod => sod.ServiceId, s => s.ServiceId,
                      (sod, s) => new { sod.Quantity, s.Price })
                .SumAsync(x => (decimal?)(x.Quantity * x.Price)) ?? 0;

            return totalPrice;
        }

        //Hàm lấy ID của nhân viên từ token
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


        //Hàm lấy địa chỉ của ô chứa từ ID
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


        // GET: Api/ServiceOrderForStaff/
        // Đây là endpoint xem danh sách các đơn đặt dịch vụ
        [HttpGet]
        public async Task<IActionResult> GetServiceOrdersList()
        {
            // Tìm thông tin trong cơ sở dữ liệu, thông qua Entity Framework
            var serviceOrders = await _context.ServiceOrders
                .Include(so => so.ServiceOrderDetails)
                    .ThenInclude(sod => sod.Service)
                .Include(so => so.Customer)
                .ToListAsync();

            // Tạo danh sách để chứa các đối tượng Data Transfer Object (DTO)
            var serviceOrderResponses = new List<ServiceOrderResponseForStaffDto>();
            foreach (var serviceOrder in serviceOrders)
            {
                // Tìm địa chỉ ô chứa theo id
                var nicheAddress = await GetNicheAddress(serviceOrder.NicheId);
                // Tạo đối tượng DTO
                var response = new ServiceOrderResponseForStaffDto
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

            // Trả về kết quả
            return Ok(serviceOrderResponses);
        }

        //GET: Api/ServiceOrderForStaff/{serviceOrderId}
        //Xem chi tiết đơn đặt dịch vụ
        [HttpGet("{serviceOrderId}")]
        public async Task<IActionResult> GetServiceOrderDetails(int serviceOrderId)
        {
            // Truy vấn đơn đặt dịch vụ bằng ID, thông qua Entity Framework
            var serviceOrder = await _context.ServiceOrders
                .Include(so => so.Customer)
                .Include(so => so.Niche)
                    .ThenInclude(n => n.Area)
                    .ThenInclude(a => a.Floor)
                    .ThenInclude(f => f.Building)
                .Include(so => so.ServiceOrderDetails)
                    .ThenInclude(sod => sod.Service)
                .FirstOrDefaultAsync(so => so.ServiceOrderId == serviceOrderId);

            // Kiểm tra nếu không tìm thấy đơn hàng
            if (serviceOrder == null)
            {
                return NotFound();
            }

            // Tính tổng giá trị của đơn hàng dịch vụ
            var totalPrice = await CalculateServiceOrderTotalAsync(serviceOrder.ServiceOrderId);

            // Tạo phản hồi chứa thông tin chi tiết của đơn hàng dịch vụ
            var response = new ServiceOrderDetailsResponse
            {
                ServiceOrderCode = serviceOrder.ServiceOrderCode,
                CustomerFullName = serviceOrder.Customer.FullName,
                OrderDate = serviceOrder.OrderDate,
                CreatedDate = serviceOrder.CreatedDate,
                CompletedBy = serviceOrder.Staff?.FullName,
                CompletedDate = serviceOrder.CompletedDate,
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

            // Trả về kết quả
            return Ok(response);
        }


        //PUT: Api/ServiceOrderForStaff/update-completion-image
        //Endponit này dùng để xác nhận hình ảnh đã hoàn thành dịch vụ
        [HttpPut("update-completion-image")]
        public async Task<IActionResult> UpdateCompletionImage([FromBody] UpdateCompletionImageRequest request)
        {
            // Lấy ID của nhân viên từ token
            var staffId = GetStaffIdFromToken();

            // Tìm kiếm chi tiết đơn hàng dịch vụ dựa trên ID
            var serviceOrderDetail = await _context.ServiceOrderDetails
                .Include(sod => sod.ServiceOrder)
                .ThenInclude(so => so.Customer)
                .FirstOrDefaultAsync(sod => sod.ServiceOrderDetailId == request.ServiceOrderDetailID);

            // Kiểm tra nếu không tìm thấy chi tiết đơn hàng
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

            // Lấy thông tin về thời gian hiện tại theo múi giờ
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var utcNow = DateTime.UtcNow;
            var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);

            // Cập nhật trạng thái sau khi up ảnh thành công
            serviceOrderDetail.CompletionImage = request.CompletionImage;
            serviceOrderDetail.Status = "Completed";

            // Kiểm tra trạng thái  và thiết lập thời gian hoàn thành 
            if (serviceOrder.CompletedDate == null)
            {
                serviceOrder.StaffId = staffId;
                serviceOrder.CompletedDate = localNow;
            }

            // Xử lý ngoại lệ
            var staff = await _context.Staff.FirstOrDefaultAsync(s => s.StaffId == staffId);
            if (staff == null)
            {
                serviceOrder.StaffId = null;
            }

            // Lưu các thay đổi vào cơ sở dữ liệu
            _context.ServiceOrderDetails.Update(serviceOrderDetail);
            _context.ServiceOrders.Update(serviceOrder);
            await _context.SaveChangesAsync();

            // Gửi email cho khách hàng với nội dung ở dưới
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
                <li><strong>Ngày hoàn thành:</strong> {serviceOrder.CompletedDate?.ToString("HH:mm dd/MM/yyyy")}</li> 
                <li><strong>Hoàn thành bởi:</strong> {(staff != null ? staff.FullName : "Không xác định")}</li> 
                <li><strong>Vị trí Ô chứa:</strong> {nicheAddress}</li>
                <li><strong>Tổng số tiền:</strong> {totalPrice}₫</li>
            </ul>
            <p><strong>Hình ảnh xác nhận:</strong></p>
            <ul>
                {string.Join("", serviceOrder.ServiceOrderDetails.Select(detail => $@"
                    <li>
                        {(string.IsNullOrEmpty(detail.CompletionImage) ? "" : $"<br/><img src=\"{detail.CompletionImage}\" alt=\"Completion Image\" style=\"max-width: 100%; height: auto;\"/>")}
                    </li>"))}
            </ul>
            <p>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng</p>";

            SendEmail(customer.Email, subject, message);

            //tra ve ket qua
            return Ok(serviceOrderDetail);
        }

        // endponint dung de tao moi 1 don dat dich vu 
        // su ddụng thêm 2 endpont khác : 
        //1 -  // GET: api/ContractForStaff/all-contracts ,  2- GET: api/Services
        //POST: api/ServiceOrderForStaff/create-service-order
        [HttpPost("create-service-order")]
        public async Task<IActionResult> CreateServiceOrder([FromBody] CreateServiceOrderRequest request)
        {
            // Lấy thông tin múi giờ từ hệ thống
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var utcNow = DateTime.UtcNow;
            var localNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZoneInfo);

            // Bắt đầu một transaction để thực hiện các thao tác thêm mới
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Tìm kiếm khách hàng theo CustomerID
                    var customer = await _context.Customers.FindAsync(request.CustomerID);
                    if (customer == null)
                    {
                        return NotFound("Customer not found.");
                    }

                    // Tìm kiếm và check kiểm tra theo id
                    var niche = await _context.Niches.FindAsync(request.NicheID);
                    if (niche == null || niche.CustomerId != customer.CustomerId)
                    {
                        return BadRequest("Niche not found or does not belong to the customer.");
                    }

                    // Tạo mã service ordercode
                    var currentDate = DateTime.Now.Date;
                    var ordersTodayCount = await _context.ServiceOrders
                        .CountAsync(so => so.CreatedDate != null && so.CreatedDate.Value.Date == currentDate);
                    var serviceOrderCode = $"DV-{currentDate:yyyyMMdd}-{(ordersTodayCount + 1):D3}";

                    // Tạo đối tượng ServiceOrder mới
                    var serviceOrder = new ServiceOrder
                    {
                        CustomerId = request.CustomerID,
                        NicheId = request.NicheID,
                        CreatedDate = localNow,
                        OrderDate = request.OrderDate,
                        ServiceOrderCode = serviceOrderCode
                    };

                    // Thêm ServiceOrder vào cơ sở dữ liệu
                    _context.ServiceOrders.Add(serviceOrder);
                    await _context.SaveChangesAsync();

                    // Thêm chi tiết các dịch vụ đã đặt vào bảng ServiceOrderDetails
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

                    // Lưu các thay đổi vào cơ sở dữ liệu
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    // Tính tổng giá của đơn hàng dịch vụ
                    var totalPrice = await CalculateServiceOrderTotalAsync(serviceOrder.ServiceOrderId);

                    // Trả về kết quả thành công 
                    return Ok(new
                    {
                        ServiceOrder = serviceOrder,
                        TotalPrice = totalPrice
                    });
                }
                catch (Exception ex)
                {
                    // Nếu có lỗi thì rollback
                    await transaction.RollbackAsync();
                    return StatusCode(500, ex.Message);
                }
            }
        }
    }
}