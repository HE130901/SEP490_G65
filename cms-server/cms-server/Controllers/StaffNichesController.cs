using cms_server.Configuration;
using cms_server.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffNichesController : ControllerBase
    {
        private readonly CmsContext _context;

        public StaffNichesController(CmsContext context)
        {
            _context = context;
        }

        // Get all niches within a specific area
        [HttpGet("area/{areaId}")]
        public async Task<ActionResult<IEnumerable<NicheDtoForStaff>>> GetNichesByArea(int areaId)
        {
            // Truy vấn các ô chứa dựa trên areaId, bao gồm lịch sử của ô chứa và truyền vào DTO
            var niches = await _context.Niches
                .Where(n => n.AreaId == areaId)
                .Include(n => n.NicheHistories)
                .Select(n => new NicheDtoForStaff
                {
                    NicheId = n.NicheId,
                    NicheName = n.NicheName,
                    // Lấy tên khách hàng và tên người mất dựa trên ID của họ
                    CustomerName = _context.Customers.FirstOrDefault(c => c.CustomerId == n.CustomerId).FullName,
                    DeceasedName = _context.Deceaseds.FirstOrDefault(d => d.DeceasedId == n.DeceasedId).FullName,
                    Description = n.NicheDescription,
                    NicheCode = n.NicheCode,
                    // Truyền thông tin lịch sử của ô chứa sang DTO
                    NicheHistories = n.NicheHistories.Select(h => new NicheHistoryDto
                    {
                        ContractId = h.ContractId.Value,
                        StartDate = h.StartDate,
                        EndDate = h.EndDate,
                        Status = h.Status
                    }).ToList(),
                    Status = n.Status
                })
                .ToListAsync();
            // Trả về danh sách các ô chứa
            return Ok(niches);
        }

        // API endpoint để lấy thông tin chi tiết của một ô chứa dựa trên nicheId
        [HttpGet("{nicheId}")]
        public async Task<ActionResult<NicheDtoForStaff>> GetNicheDetail(int nicheId)
        {
             // Lấy thông tin của ô chứa cùng với lịch sử của nó dựa trên nicheId
            var niche = await _context.Niches
                .Include(n => n.NicheHistories)
                .FirstOrDefaultAsync(n => n.NicheId == nicheId);
            // Trả về lỗi 404 nếu không tìm thấy ô chứa
            if (niche == null)
            {
                return NotFound();
            }
            // Truyền thông tin chi tiết và lịch sử của ô chứa sang DTO
            var nicheDto = new NicheDtoForStaff
            {
                NicheId = niche.NicheId,
                NicheName = niche.NicheName,
                CustomerName = _context.Customers.FirstOrDefault(c => c.CustomerId == niche.CustomerId)?.FullName,
                DeceasedName = _context.Deceaseds.FirstOrDefault(d => d.DeceasedId == niche.DeceasedId)?.FullName,
                Description = niche.NicheDescription,
                NicheCode = niche.NicheCode,
                NicheHistories = niche.NicheHistories.Select(h => new NicheHistoryDto
                {
                    ContractId = h.ContractId.Value,
                    ContractCode = _context.Contracts.FirstOrDefault(c => c.ContractId == h.ContractId).ContractCode,
                    StartDate = h.StartDate,
                    EndDate = h.EndDate,
                    Status = h.Status
                }).ToList(),
                Status = niche.Status
            };
            // Trả về thông tin chi tiết của ô chứa
            return Ok(nicheDto);
        }

        // API endpoint để cập nhật thông tin của một ô chứa hiện có
        [HttpPut("{nicheId}")]
        public async Task<IActionResult> UpdateNiche(int nicheId, UpdateNicheDto updateNicheDto)
        {
            // Tìm ô chứa trong cơ sở dữ liệu bằng nicheId
            var niche = await _context.Niches.FindAsync(nicheId);
            
            // Trả về lỗi 404 nếu không tìm thấy ô chứa
            if (niche == null)
            {
                return NotFound();
            }
            // Cập nhật thông tin trạng thái và mô tả của ô chứa 
            niche.NicheDescription = updateNicheDto.NicheDescription;
            niche.Status = updateNicheDto.Status;

            try
            {
                // Lưu các thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Nếu xảy ra lỗi về cập nhật đồng thời, kiểm tra xem ô chứa còn tồn tại hay không
                if (!NicheExists(nicheId))
                {
                    return NotFound();
                }
                else
                {
                    throw; // Ném lại ngoại lệ nếu ô chứa vẫn còn tồn tại
                }
            }
            // Trả về NoContent (204) nếu cập nhật thành công
            return NoContent();
        }

        // Phương thức hỗ trợ để kiểm tra xem một ô chứa có tồn tại trong cơ sở dữ liệu hay không?
        private bool NicheExists(int id)
        {
            return _context.Niches.Any(e => e.NicheId == id);
        }
    }

}

