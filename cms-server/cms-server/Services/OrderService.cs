using cms_server.Configuration;
using cms_server.DTOs;
using cms_server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Services
{
    public class OrderService
    {
        private readonly CmsContext _context;

        public OrderService(CmsContext context)
        {
            _context = context;
        }

        public async Task<List<PendingOrderSummaryDto>> GetPendingOrdersAsync()
        {
            var visitRegistrationsCount = await _context.VisitRegistrations
                .Where(v => v.Status == "Pending")
                .CountAsync();

            var nicheReservationsCount = await _context.NicheReservations
                .Where(n => n.Status == "Pending")
                .CountAsync();

            var serviceOrdersCount = await _context.ServiceOrderDetails
                .Where(s => s.Status == "Pending")
                .CountAsync();

            var summary = new List<PendingOrderSummaryDto>
            {
                new PendingOrderSummaryDto { Type = "Đơn đăng ký viếng", Count = visitRegistrationsCount },
                new PendingOrderSummaryDto { Type = "Đơn đặt ô chứa", Count = nicheReservationsCount },
                new PendingOrderSummaryDto { Type = "Đơn đặt dịch vụ", Count = serviceOrdersCount }
            };

            return summary;
        }
    }
}
