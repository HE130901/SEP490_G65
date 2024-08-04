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

        [HttpGet("niche-summary")]
        public ActionResult<NicheDetailsReport> GetNicheDetails()
        {
            var totalNiches = _context.Niches.Count();
            var occupiedNiches = _context.Niches.Count(n => n.Status == "Active");
            var reservedNiches = _context.Niches.Count(n => n.Status == "Booked");
            var availableNiches = _context.Niches.Count(n => n.Status == "Available");
            var unavailableNiches = _context.Niches.Count(n => n.Status == "Unavailable");


            var nichesByArea = _context.Niches
                .GroupBy(n => n.AreaId)
                .Select(g => new AreaReport
                {
                    AreaId = g.Key,
                    AreaAddress = $"{g.FirstOrDefault().Area.Floor.Building.BuildingName} - {g.FirstOrDefault().Area.Floor.FloorName} - {g.FirstOrDefault().Area.AreaName}",
                    Count = g.Count(),
                    Occupied = g.Count(n => n.Status == "Active"),
                    Reserved = g.Count(n => n.Status == "Booked"),
                    Available = g.Count(n => n.Status == "Available"),
                    Unavailable = g.Count(n => n.Status == "Unavailable")
                }).ToList();

            var nichesByStatus = _context.Niches
                .GroupBy(n => n.Status)
                .Select(g => new StatusReport
                {
                    Status = g.Key,
                    Count = g.Count()
                }).ToList();

            var totalServiceOrders = _context.ServiceOrders.Count();
            var totalVisitRegistrations = _context.VisitRegistrations.Count();

            var report = new NicheDetailsReport
            {
                TotalNiches = totalNiches,
                OccupiedNiches = occupiedNiches,
                ReservedNiches = reservedNiches,
                AvailableNiches = availableNiches,
                NichesByArea = nichesByArea,
                NichesByStatus = nichesByStatus,
                TotalServiceOrders = totalServiceOrders,
                TotalVisitRegistrations = totalVisitRegistrations
            };

            return Ok(report);
        }
    }
}

    public class NicheDetailsReport
    {
        public int TotalNiches { get; set; }
        public int OccupiedNiches { get; set; }
        public int ReservedNiches { get; set; }
        public int AvailableNiches { get; set; }

    public int UnavailableNiches { get; set; }
    public List<AreaReport> NichesByArea { get; set; } = new List<AreaReport>();
        public List<StatusReport> NichesByStatus { get; set; } = new List<StatusReport>();
        public int TotalServiceOrders { get; set; }
        public int TotalVisitRegistrations { get; set; }
    }

    public class AreaReport
    {
        public int AreaId { get; set; }
    public string AreaAddress { get; set; }
    public int Count { get; set; }
        public int Occupied { get; set; }
        public int Reserved { get; set; }
        public int Available { get; set; }
    public int Unavailable { get; set; }
}

    public class StatusReport
    {
        public string Status { get; set; }
        public int Count { get; set; }
    }


    public class ContractSummaryReport
    {
        public int TotalContracts { get; set; }
        public int ActiveContracts { get; set; }
        public int InactiveContracts { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageContractValue { get; set; }
        public List<ContractStatusReport> ContractsByStatus { get; set; } = new List<ContractStatusReport>();
    }

    public class ContractStatusReport
    {
        public string Status { get; set; }
        public int Count { get; set; }
        public decimal TotalAmount { get; set; }
    }


    public class ServiceOverviewDTO
    {
        public int TotalServices { get; set; }
        public decimal? TotalRevenue { get; set; }
        public decimal? AverageOrderValue { get; set; }
        public Dictionary<string, int> ServicesByCategory { get; set; }
        public Dictionary<string, decimal?> RevenueByCategory { get; set; }
        public Dictionary<string, int> ServicesByStatus { get; set; }
    }



