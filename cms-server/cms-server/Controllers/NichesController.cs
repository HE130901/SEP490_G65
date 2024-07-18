using cms_server.DTOs;
using cms_server.Services;
using Microsoft.AspNetCore.Mvc;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NichesController : ControllerBase
    {
        private readonly INicheService _nicheService;

        public NichesController(INicheService nicheService)
        {
            _nicheService = nicheService;
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<NicheDto>>> GetNiches(int customerId)
        {
            var niches = await _nicheService.GetNichesAsync(customerId);
            return Ok(niches);
        }

        [HttpGet("{nicheId}/details")]
        public async Task<ActionResult<NicheDetailDto>> GetNicheDetail(int nicheId)
        {
            try
            {
                var nicheDetail = await _nicheService.GetNicheDetailAsync(nicheId);
                return Ok(nicheDetail);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}