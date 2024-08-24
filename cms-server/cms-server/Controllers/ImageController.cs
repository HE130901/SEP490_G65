using cms_server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly ImageUploadService _imageUploadService;

        public ImageController(ImageUploadService imageUploadService)
        {
            _imageUploadService = imageUploadService;
        }

        //POST : Api/Image/Upload
        //Endpoint này dùng để up ảnh
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty");
            //Dùng service up ảnh ở ImageUploadServic
            var result = await _imageUploadService.UploadImageAsync(file);
            return Ok(result);
        }
    }
}
