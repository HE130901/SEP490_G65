using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractForStaffController : ControllerBase
    {
        private readonly CmsContext _context;

        private readonly IConfiguration _configuration;

        public ContractForStaffController(CmsContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private async Task<bool> IsDuplicateDeathCertificateNumberAsync(string deathCertificateNumber)
        {
            return await _context.Deceaseds.AnyAsync(d => d.DeathCertificateNumber == deathCertificateNumber);
        }

        private string GenerateRandomPassword(int length = 12)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
            var random = new Random();
            return new string(Enumerable.Repeat(validChars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        // POST: api/ContractForStaff/create-contract
        [HttpPost("create-contract")]
        [Authorize]
        public async Task<IActionResult> CreateContract(CreateContractRequest request)
        {
            // Lấy StaffId từ token
            var staffIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (staffIdClaim == null || !int.TryParse(staffIdClaim, out int staffId))
            {
                return Unauthorized("Invalid or missing Staff ID in token.");
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Kiểm tra và lấy thông tin niche
                    var niche = await _context.Niches.FirstOrDefaultAsync(n => n.NicheId == request.NicheID &&
                                 (n.Status == "Available" || n.Status == "Booked"));

                    if (niche == null)
                    {
                        return BadRequest("Ô chứa không khả dụng để đặt chỗ");
                    }

                    // Kiểm tra và lấy thông tin khách hàng
                    var customer = await _context.Customers
                        .FirstOrDefaultAsync(c => c.CitizenId == request.CustomerCitizenId);

                    if (customer == null)
                    {
                        // Tạo khách hàng mới nếu không tồn tại
                        customer = new Customer
                        {
                            FullName = request.CustomerFullName,
                            Phone = request.CustomerPhoneNumber,
                            Email = request.CustomerEmail,
                            Address = request.CustomerAddress,
                            CitizenId = request.CustomerCitizenId,
                            CitizenIdissuanceDate = request.CustomerCitizenIdIssueDate,
                            CitizenIdsupplier = request.CustomerCitizenIdSupplier,
                            // Mật khẩu mặc định abcdabcd
                            PasswordHash = "$2a$11$nUOFWiAMFi4zIAbIkYAbcuhFx3JYvT4ELKpBE6kh7IN5S9/wsfk4q"
                            //PasswordHash = BCrypt.Net.BCrypt.HashPassword(GenerateRandomPassword())
                    };
                        _context.Customers.Add(customer);
                        await _context.SaveChangesAsync();

                        // Gửi email thông báo cho khách hàng mới
                        var subject = "Chào mừng bạn đến với dịch vụ của An Bình Viên!";
                        var message = $"Kính gửi {customer.FullName},<br/><br/>Cảm ơn quý khách hàng đã đăng ký dịch vụ của chúng tôi. Tài khoản của bạn là: {customer.Email} - mật khẩu đăng nhập: abcdabcd <br/> Quý khách hàng vui lòng thay đổi mật khẩu sau khi đăng nhập thành công.<br/><br/>Trân trọng,<br/>Đội ngũ hỗ trợ khách hàng";
                        SendEmail(customer.Email, subject, message);
                    }

                    // Kiểm tra trùng lặp số giấy chứng tử
                    bool isDuplicateDeathCertificate = await IsDuplicateDeathCertificateNumberAsync(request.DeathCertificateNumber);
                    if (isDuplicateDeathCertificate)
                    {
                        return BadRequest("Đã có người mất đăng ký với số giấy chứng tử này!");
                    }


                    // Tạo đối tượng Deceased
                    var deceased = new Deceased
                    {
                        FullName = request.DeceasedFullName,
                        DateOfBirth = request.DeceasedDateOfBirth,
                        DateOfDeath = request.DeceasedDateOfDeath,
                        NicheId = niche.NicheId,
                        CustomerId = customer.CustomerId,
                        DeathCertificateNumber = request.DeathCertificateNumber,
                        DeathCertificateSupplier = request.DeathCertificateSupplier,
                        CitizenId = request.DeceasedCitizenId,
                        RelationshipWithCusomer = request.RelationshipWithCustomer
                    };
                    _context.Deceaseds.Add(deceased);
                    await _context.SaveChangesAsync();

                    // Tạo mã hợp đồng
                    var startDateStr = request.StartDate.ToString("yyyyMMdd");
                    var contractsStartDateCount = await _context.Contracts.CountAsync(c => c.StartDate == request.StartDate);
                    var contractNumber = (contractsStartDateCount + 1).ToString("D3");
                    var contractCode = $"HD-{startDateStr}-{contractNumber}";

                    // Tạo đối tượng Contract
                    var contract = new Contract
                    {
                        ContractCode = contractCode,
                        CustomerId = customer.CustomerId,
                        StaffId = staffId,
                        NicheId = niche.NicheId,
                        DeceasedId = deceased.DeceasedId,
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Status = "Active",
                        Note = request.Note,
                        TotalAmount = request.TotalAmount
                    };
                    _context.Contracts.Add(contract);
                    await _context.SaveChangesAsync();


    }
}