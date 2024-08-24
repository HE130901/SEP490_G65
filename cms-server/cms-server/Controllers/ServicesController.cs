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
        // Lấy danh sách tất cả các dịch vụ
        // với chức năng thêm mới đơn đặt dịch vụ thì lấy danh sách tất cả các dịch vụ có trạng thái avalibale trong hệ thống
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        // GET: api/Services/5
        // get thu 2 lay chi tiet
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
        // Chỉnh sửa thông tin của dịch vụ
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(int id, ServiceUpdateDto serviceDto)
        {
            if (id != serviceDto.ServiceId)
            {
                return BadRequest();
            }

            // Tìm dịch vụ theo id, thông qua Entity Framework
            var existingService = await _context.Services.FindAsync(id);

            // Check dịch vụ tồn tại
            if (existingService == null)
            {
                return NotFound();
            }

            // Cập nhật thông tin của dịch vụ với các giá trị mới từ DTO
            existingService.ServiceName = serviceDto.ServiceName;
            existingService.Description = serviceDto.Description;
            existingService.Price = serviceDto.Price;
            existingService.ServicePicture = serviceDto.ServicePicture;
            existingService.Category = serviceDto.Category;
            existingService.Tag = serviceDto.Tag;
            existingService.Status = serviceDto.Status;

            // Lưu thay đổi vào cơ sở dữ liệu bằng Entity Framework
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

            // Thông báo thành công
            return NoContent();
        }

        // POST: api/Services
        // endpoint tao moi dich vu (post service)
        [HttpPost]
        public async Task<ActionResult<Service>> PostService(Service service)
        {
            //Thêm dịch vụ mới vào cơ sở dữ liệu
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetService", new { id = service.ServiceId }, service);
        }



        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            // Tìm dịch vụ theo id, thông qua Entity Framework
            var service = await _context.Services.FindAsync(id);

            // Kiểm tra nếu không tìm thấy dịch vụ
            if (service == null)
            {
                return NotFound();
            }

            // Cập nhật trạng thái của dịch vụ thành "Unavailable" thay vì xóa hoàn toàn
            service.Status = "Unavailable";

            // Lưu các thay đổi vào cơ sở dữ liệu bằng Entity Framework
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

            // Trả về thông báo thành công
            return NoContent();
        }


        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.ServiceId == id);
        }

    }
}