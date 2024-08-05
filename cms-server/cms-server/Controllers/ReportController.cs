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
// Group by Status (or any other relevant field)
            var contractsByStatus = _context.Contracts
                .GroupBy(c => c.Status)
                .Select(g => new ContractStatusReport
                {
                    Status = g.Key,
                    Count = g.Count(),
                    TotalAmount = Math.Round(g.Sum(c => c.TotalAmount ?? 0))
                })
                .ToList();
 var report = new ContractSummaryReport
            {
                TotalContracts = totalContracts,
                ActiveContracts = activeContracts,
                InactiveContracts = inactiveContracts,
                TotalRevenue = Math.Round(totalRevenue),
                AverageContractValue = Math.Round(averageContractValue),
                ContractsByStatus = contractsByStatus
            };

            return Ok(report);
        }
[HttpGet("services-summary")]
        public ActionResult<ServiceOverviewDTO> GetServiceOverview()
        {
            var totalServices = _context.ServiceOrders.Count();
            var totalRevenue = _context.ServiceOrderDetails
                .Sum(sod => sod.Quantity * sod.Service.Price);
            var averageOrderValue = totalServices > 0 ? totalRevenue / totalServices : 0;

            var servicesByCategory = _context.Services
                .GroupBy(s => s.Category)
                .ToDictionary(g => g.Key, g => g.Count());
var revenueByCategory = _context.ServiceOrderDetails
                .GroupBy(sod => sod.Service.Category)
                .ToDictionary(
                    g => g.Key,
                    g => g.Sum(sod => sod.Quantity * sod.Service.Price)
                );

            var servicesByStatus = _context.ServiceOrderDetails
                .GroupBy(sod => sod.Status)
                .ToDictionary(g => g.Key, g => g.Count());
 var overview = new ServiceOverviewDTO
            {
                TotalServices = totalServices,
                TotalRevenue = totalRevenue,
                AverageOrderValue = averageOrderValue,
                ServicesByCategory = servicesByCategory,
                RevenueByCategory = revenueByCategory,
                ServicesByStatus = servicesByStatus,
            };

            return Ok(overview);
        }