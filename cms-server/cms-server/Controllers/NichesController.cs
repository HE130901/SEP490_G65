using cms_server.DTOs;
using cms_server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NichesController : ControllerBase
    {
        private readonly NicheService _nicheService;

        public NichesController(NicheService nicheService)
        {
            _nicheService = nicheService;
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<NicheDto>>> GetNiches(int customerId)
        {
            var niches = await _nicheService.GetNichesAsync(customerId);
            return Ok(niches);
        }

        [HttpGet("{nicheId}")]
        public async Task<ActionResult<NicheDetailDto>> GetNicheDetail(int nicheId)
        {
            var nicheDetail = await _nicheService.GetNicheDetailAsync(nicheId);
            return Ok(nicheDetail);
        }
    }
}
