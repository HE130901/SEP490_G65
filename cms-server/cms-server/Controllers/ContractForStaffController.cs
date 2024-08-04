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

                    // Cập nhật trạng thái niche
                    niche.Status = "Active";
                    niche.CustomerId = customer.CustomerId;
                    niche.DeceasedId = deceased.DeceasedId;
                    _context.Niches.Update(niche);
                    await _context.SaveChangesAsync();

                    // Tìm đơn đặt chỗ và cập nhật trạng thái
                    var reservation = await _context.NicheReservations.FirstOrDefaultAsync(r => r.ReservationId == request.ReservationId);
                    if (reservation != null)
                    {
                        reservation.Status = "Signed";
                        _context.NicheReservations.Update(reservation);
                        await _context.SaveChangesAsync();
                    }

                    await transaction.CommitAsync();

                    return Ok(contract);
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


        // GET: api/ContractForStaff/all-contracts
        [HttpGet("all-contracts")]
        public async Task<IActionResult> GetAllContracts()
        {
            var contracts = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Niche)

                .Select(c => new ContractForStaffDto
                {
                    ContractId = c.ContractId,
                    NicheId = c.NicheId,
                    CustomerId = c.CustomerId,
                    NicheAddress = $"{c.Niche.Area.Floor.Building.BuildingName}-{c.Niche.Area.Floor.FloorName}-{c.Niche.Area.AreaName}-Ô {c.Niche.NicheName}",
                    CustomerName = c.Customer.FullName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status,
                    ContractCode = c.ContractCode,
                    NicheCode = c.Niche.NicheCode,
                })
                .ToListAsync();
            return Ok(contracts);
        }

        // New method to get details of a specific contract by ID
        [HttpGet("contract/{id}")]
        public async Task<IActionResult> GetContractById(int id)
        {
            var contract = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Niche)
                .Select(c => new ContractForStaffDto
                {
                    ContractId = c.ContractId,
                    NicheAddress = $"{c.Niche.Area.Floor.Building.BuildingName}-{c.Niche.Area.Floor.FloorName}-{c.Niche.Area.AreaName}-{c.Niche.NicheName}",
                    CustomerName = c.Customer.FullName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status,
                    ContractCode = c.ContractCode
                })
                .FirstOrDefaultAsync(c => c.ContractId == id);

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }

        [HttpPost("renew-contract")]
        public async Task<IActionResult> RenewContract(int contractId, [FromBody] RenewContractRequest request)
        {
            if (!DateOnly.TryParse(request.NewEndDate, out var parsedEndDate))
            {
                return BadRequest("Invalid date format.");
            }

            var contract = await _context.Contracts
                .Include(c => c.ContractRenews)
                .FirstOrDefaultAsync(c => c.ContractId == contractId);

            if (contract == null)
            {
                return NotFound("Contract not found.");
            }

            contract.Status = "Extended";
            _context.Contracts.Update(contract);
            await _context.SaveChangesAsync();

            int renewalCount = contract.ContractRenews.Count + 1;
            string renewalCode = GenerateRenewalCode(contract.ContractCode, renewalCount);

            var contractRenew = new ContractRenew
            {
                ContractId = contract.ContractId,
                ContractRenewCode = renewalCode,
                Status = "Active",
                CreatedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                EndDate = parsedEndDate,
                TotalAmount = request.TotalAmount,
                Note = "Gia hạn " + contract.ContractCode
            };
            _context.ContractRenews.Add(contractRenew);
            await _context.SaveChangesAsync();

            return Ok(contractRenew);
        }




        private string GenerateRenewalCode(string contractCode, int renewalCount)
        {
            // Extract the date part and suffix from the contract code
            var parts = contractCode.Split('-');
            if (parts.Length != 3)
            {
                throw new InvalidOperationException("Invalid contract code format.");
            }

            string datePart = parts[1]; // e.g., "20220725"
            string suffix = parts[2]; // e.g., "001"

            // Format the renewal code
            return $"GH{renewalCount:D2}-{datePart}-{suffix}";
        }

        // POST: api/Contracts/cancel-contract
        [HttpPost("cancel-contract")]
        public async Task<IActionResult> CancelContract(int contractId)
        {
            // Find the contract by ID
            var contract = await _context.Contracts
                .FirstOrDefaultAsync(c => c.ContractId == contractId);

            if (contract == null)
            {
                return NotFound("Contract not found.");
            }

            // Update the contract status to "Canceled"
            contract.Status = "Canceled";
            contract.Note = "Thanh lý hợp đồng " + contract.ContractCode + " vào ngày " + DateOnly.FromDateTime(DateTime.Now);
            _context.Contracts.Update(contract);

            // Find the associated niche and set its status to "Available"
            var niche = await _context.Niches.FirstOrDefaultAsync(n => n.NicheId == contract.NicheId);
            if (niche != null)
            {
                niche.Status = "Available";
                niche.CustomerId = null; // Reset the CustomerId
                niche.DeceasedId = null; // Reset the DeceasedId
                _context.Niches.Update(niche);
            }

            // Save the changes
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // GET: api/Contracts/buildings
        [HttpGet("buildings")]
        public async Task<ActionResult<IEnumerable<BuildingDto>>> GetBuildings()
        {
            var buildings = await _context.Buildings
                .Select(b => new BuildingDto
                {
                    BuildingId = b.BuildingId,
                    BuildingName = b.BuildingName
                })
                .ToListAsync();

            return Ok(buildings);
        }

        // GET: api/Contracts/buildings/{buildingId}/floors
        [HttpGet("buildings/{buildingId}/floors")]
        public async Task<ActionResult<IEnumerable<FloorDto>>> GetFloors(int buildingId)
        {
            var floors = await _context.Floors
                .Where(f => f.BuildingId == buildingId)
                .Select(f => new FloorDto
                {
                    FloorId = f.FloorId,
                    FloorName = f.FloorName
                })
                .ToListAsync();

            return Ok(floors);
        }

        // GET: api/Contracts/buildings/{buildingId}/floors/{floorId}/areas
        [HttpGet("buildings/{buildingId}/floors/{floorId}/areas")]
        public async Task<ActionResult<IEnumerable<AreaDto>>> GetZones(int buildingId, int floorId)
        {
            var areas = await _context.Areas
                .Where(a => a.FloorId == floorId)
                .Select(a => new AreaDto
                {
                    AreaId = a.AreaId,
                    AreaName = a.AreaName
                })
                .ToListAsync();

            return Ok(areas);
        }

        // GET: api/Contracts/buildings/{buildingId}/floors/{floorId}/areas/{zoneId}/niches
        [HttpGet("buildings/{buildingId}/floors/{floorId}/areas/{areaId}/niches")]
        public async Task<ActionResult<IEnumerable<NicheDto>>> GetNiches(int buildingId, int floorId, int areaId)
        {
            var niches = await _context.Niches
                .Where(n => n.AreaId == areaId)
                .Select(n => new NicheDto
                {
                    NicheId = n.NicheId,
                    NicheName = n.NicheName,
                    NicheStatus = n.Status
                })
                .ToListAsync();

            return Ok(niches);
        }

        [HttpGet("contract-renewal/{renewalId}")]
        public async Task<IActionResult> GetContractRenewalById(int renewalId)
        {
            var renewal = await _context.ContractRenews
                .Include(cr => cr.Contract)
                .ThenInclude(c => c.Customer)
                .Include(cr => cr.Contract)
                .ThenInclude(c => c.Niche)
                .Select(cr => new ContractRenewalDetailsDto
                {
                    ContractRenewalId = cr.ContractRenewId,
                    ContractRenewCode = cr.ContractRenewCode,
                    Status = cr.Status,
                    CreatedDate = cr.CreatedDate,
                    EndDate = cr.EndDate,
                    TotalAmount = cr.TotalAmount,
                    Note = cr.Note,
                    CustomerName = cr.Contract.Customer.FullName,
                    NicheAddress = $"{cr.Contract.Niche.Area.Floor.Building.BuildingName} - {cr.Contract.Niche.Area.Floor.FloorName} - {cr.Contract.Niche.Area.AreaName} - {cr.Contract.Niche.NicheName}",
                    ContractCode = cr.Contract.ContractCode
                })
                .FirstOrDefaultAsync(cr => cr.ContractRenewalId == renewalId);

            if (renewal == null)
            {
                return NotFound("Contract renewal not found.");
            }

            return Ok(renewal);
        }
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



    }

    public class CreateContractRequest
    {
        public string CustomerFullName { get; set; }
        public string? CustomerPhoneNumber { get; set; }
        public string CustomerEmail { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerCitizenId { get; set; }
        public DateOnly? CustomerCitizenIdIssueDate { get; set; }
        public string? CustomerCitizenIdSupplier { get; set; }
        public string DeceasedFullName { get; set; }
        public string? DeceasedCitizenId { get; set; }
        public DateOnly? DeceasedDateOfBirth { get; set; }
        public DateOnly? DeceasedDateOfDeath { get; set; }
        public string? DeathCertificateNumber { get; set; }
        public string? DeathCertificateSupplier { get; set; }
        public string? RelationshipWithCustomer { get; set; }
        public int? NicheID { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Note { get; set; }
        public decimal? TotalAmount { get; set; }
        public int ReservationId { get; set; }
    }


public class ContractForStaffDto
    {
        public int ContractId { get; set; }
        public int NicheId { get; set; }
        public int CustomerId { get; set; }
        public string NicheAddress { get; set; }
        public string CustomerName { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string Status { get; set; }
        public string ContractCode { get; set; }
        public string NicheCode { get; set; }

    }
}
public class RenewContractRequest
{
    public string NewEndDate { get; set; }
    public decimal TotalAmount { get; set; }
}
public class ContractRenewalDetailsDto
{
    public int ContractRenewalId { get; set; }
    public string ContractRenewCode { get; set; }
    public string Status { get; set; }
    public DateOnly? CreatedDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? TotalAmount { get; set; }
    public string Note { get; set; }
    public string CustomerName { get; set; }
    public string NicheAddress { get; set; }
    public string ContractCode { get; set; }
}


