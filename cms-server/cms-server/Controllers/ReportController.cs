using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly CmsContext _context;

        public ReportController(CmsContext context)
        {
            _context = context;
        }
[HttpGet("contract-summary")]
        public ActionResult<ContractSummaryReport> GetContractSummary()
        {
            var totalContracts = _context.Contracts.Count();
            var activeContracts = _context.Contracts.Count(c => c.Status == "Active");
            var inactiveContracts = _context.Contracts.Count(c => c.Status != "Active");
            var totalRevenue = _context.Contracts.Sum(c => c.TotalAmount ?? 0);
            var averageContractValue = totalContracts > 0 ? totalRevenue / totalContracts : 0;
