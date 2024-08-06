
using cms_server.DTOs;
using cms_server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("pending")]
        public async Task<ActionResult<List<PendingOrderSummaryDto>>> GetPendingOrders()
        {
            var orders = await _orderService.GetPendingOrdersAsync();
            return Ok(orders);
        }
    }
}
