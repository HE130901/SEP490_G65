namespace cms_server.Services
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Net.Http.Headers;

    public class ImageUploadService
    {
        private readonly HttpClient _httpClient;
        private const string ApiKey = "6d207e02198a847aa98d0a2a901485a5";
        private const string ApiUrl = "https://freeimage.host/api/1/upload";

        public ImageUploadService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            // Kiểm tra nếu file null hoặc có kích thước bằng 0
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null", nameof(file));

            // Tạo nội dung yêu cầu với MultipartFormDataContent
            using var content = new MultipartFormDataContent();
            using var stream = file.OpenReadStream();
            using var fileContent = new StreamContent(stream);

            try
            {
                // Đặt tiêu đề Content-Type cho file
                fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
                content.Add(fileContent, "source", file.FileName);
                content.Add(new StringContent(ApiKey), "key");

                // Gửi yêu cầu POST đến API để tải lên hình ảnh
                var response = await _httpClient.PostAsync(ApiUrl, content);
                response.EnsureSuccessStatusCode();

                // Đọc và phân tích phản hồi từ API
                var result = await response.Content.ReadAsStringAsync();
                var json = JObject.Parse(result);
                return json["image"]["url"].ToString();
            }
            catch (HttpRequestException ex)
            {
                // Xử lý lỗi khi yêu cầu HTTP gặp sự cố
                throw new Exception("Error uploading image to FreeImage.host", ex);
            }
            catch (JsonException ex)
            {
                // Xử lý lỗi khi phân tích phản hồi từ API gặp sự cố
                throw new Exception("Error parsing response from FreeImage.host", ex);
            }
        }
    }
}