using cms_server.DTOs;
using cms_server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

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
       
        [HttpGet("customer")]
        [Authorize]
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
   
        [HttpGet("{nicheId}/details-for-customer")]
        public async Task<ActionResult<NicheDetailDto3>> GetNicheDetail3(int nicheId)
        {
            try
            {
                var nicheDetail = await _nicheService.GetNicheDetailAsync3(nicheId);
                return Ok(nicheDetail);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
