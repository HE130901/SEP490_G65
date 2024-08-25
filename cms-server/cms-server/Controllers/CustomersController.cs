using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using cms_server.Configuration;
using cms_server.DTOs;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CmsContext _context;

        public CustomersController(CmsContext context)
        {
            _context = context;
        }

        // GET: api/Customers
         // API endpoint để lấy danh sách tất cả khách hàng
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
             // Truy vấn cơ sở dữ liệu để lấy danh sách khách hàng và truyền vào DTO
            return await _context.Customers
                .Select(customer => new CustomerDto
                {
                    CustomerId = customer.CustomerId,
                    FullName = customer.FullName,
                    Email = customer.Email,
                    Phone = customer.Phone,
                    Address = customer.Address,
                    CitizenId = customer.CitizenId
                })
                .ToListAsync();
        }

        // GET: api/Customers/5
        // API endpoint để lấy thông tin chi tiết của một khách hàng dựa trên ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            // Tìm kiếm khách hàng trong cơ sở dữ liệu bằng ID
            var customer = await _context.Customers.FindAsync(id);

            // Trả về mã lỗi 404 nếu không tìm thấy khách hàng
            if (customer == null)
            {
                return NotFound();
            }

            // Trả về đối tượng khách hàng
            return customer;
        }

        // PUT: api/Customers/5
        // API endpoint để cập nhật thông tin của một khách hàng hiện có
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, UpdateCustomerDto updateDto)
        {
            // Tìm kiếm khách hàng trong cơ sở dữ liệu bằng ID
            var customer = await _context.Customers.FindAsync(id);

            // Trả về mã lỗi 404 nếu không tìm thấy khách hàng
            if (customer == null)
            {
                return NotFound();
            }
            // Cập nhật thông tin của khách hàng với dữ liệu được cung cấp từ DTO
            customer.FullName = updateDto.FullName;
            customer.Email = updateDto.Email;
            customer.Phone = updateDto.Phone;
            customer.Address = updateDto.Address;
            customer.CitizenId = updateDto.CitizenId;
            customer.CitizenIdissuanceDate = updateDto.CitizenIdissuanceDate;
            customer.CitizenIdsupplier = updateDto.CitizenIdsupplier;

            // Đánh dấu thực thể khách hàng đã được sửa đổi trong context
            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                // Lưu các thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Xử lý các ngoại lệ liên quan đến cập nhật đồng thời
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            // Trả về NoContent (204) nếu cập nhật thành công
            return NoContent();
        }

        // PUT: api/Customers/5/ChangePassword
        // API endpoint để thay đổi mật khẩu của khách hàng
        [HttpPut("{id}/ChangePassword")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordDto2 changePasswordDto)
        {
            // Tìm kiếm khách hàng trong cơ sở dữ liệu bằng ID
            var customer = await _context.Customers.FindAsync(id);
            
            // Trả về mã lỗi 404 nếu không tìm thấy khách hàng
            if (customer == null)
            {
                return NotFound();
            }

            // Kiểm tra tính hợp lệ của mật khẩu mới, đảm bảo rằng không trống
            if (string.IsNullOrEmpty(changePasswordDto.Password))
            {
                return BadRequest("Password cannot be empty.");
            }

            // Mã hóa mật khẩu mới và cập nhật trong cơ sở dữ liệu
            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.Password);

            // Đánh dấu thực thể khách hàng đã được sửa đổi trong context
            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                // Lưu các thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Xử lý các ngoại lệ liên quan đến cập nhật đồng thời
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // Trả về NoContent (204) nếu thay đổi mật khẩu thành công
            return NoContent();
        }

        // POST: api/Customers
        // API endpoint để tạo mới một khách hàng
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            // Thêm khách hàng mới vào cơ sở dữ liệu
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            // Trả về CreatedAtAction với thông tin chi tiết của khách hàng mới được tạo
            return CreatedAtAction("GetCustomer", new { id = customer.CustomerId }, customer);
        }        

        // Phương thức hỗ trợ để kiểm tra xem một khách hàng có tồn tại trong cơ sở dữ liệu hay không
        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }
    }

    
}
