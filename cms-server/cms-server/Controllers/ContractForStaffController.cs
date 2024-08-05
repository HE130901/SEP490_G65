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
    }
}