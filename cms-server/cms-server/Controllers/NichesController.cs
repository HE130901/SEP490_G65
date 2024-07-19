using cms_server.DTOs;
using cms_server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NichesController : ControllerBase
    {
        private readonly INicheService _nicheService;

        public NichesController(INicheService nicheService)
        {
            _nicheService = nicheService;
        }

        [HttpGet("customer")]
        public async Task<ActionResult<IEnumerable<NicheDto>>> GetNiches()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token");
            }

            int customerId = int.Parse(userIdClaim.Value);

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
