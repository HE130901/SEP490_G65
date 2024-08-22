using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using cms_server.Configuration;
using System.Text;
using cms_server.DTOs;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly CmsContext _context;

        public ServicesController(CmsContext context)
        {
            _context = context;
        }
      

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // PUT: api/Services/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(int id, ServiceUpdateDto serviceDto)
        {
            if (id != serviceDto.ServiceId)
            {
                return BadRequest();
            }

            // Tìm dịch vụ hiện tại trong cơ sở dữ liệu
            var existingService = await _context.Services.FindAsync(id);
            if (existingService == null)
            {
                return NotFound();
            }

            // Cập nhật thông tin dịch vụ
            existingService.ServiceName = serviceDto.ServiceName;
            existingService.Description = serviceDto.Description;
            existingService.Price = serviceDto.Price;
            existingService.ServicePicture = serviceDto.ServicePicture;
            existingService.Category = serviceDto.Category;
            existingService.Tag = serviceDto.Tag;
            existingService.Status = serviceDto.Status;

            try
            {
                // Lưu các thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }






        // POST: api/Services
        [HttpPost]
        public async Task<ActionResult<Service>> PostService(Service service)
        {
            // Chuẩn hóa tên dịch vụ 
            var normalizedServiceName = service.ServiceName.Normalize(NormalizationForm.FormC);

            // Kiểm tra xem dịch vụ với tên đã tồn tại hay chưa
            var existingService = await _context.Services
                .FirstOrDefaultAsync(s =>
                    s.ServiceName.Normalize(NormalizationForm.FormC) == normalizedServiceName);
            if (existingService != null)
            {
                return BadRequest("Dịch vụ với tên này đã tồn tại.");
            }
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetService", new { id = service.ServiceId }, service);
        }



        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

           
            service.Status = "Unavailable";
            _context.Entry(service).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.ServiceId == id);
        }

    }
}
