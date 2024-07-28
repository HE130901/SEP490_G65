using cms_server.Models;
using Microsoft.EntityFrameworkCore;

namespace cms_server.Services
{
    public class VisitReservationStatusUpdateService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<VisitReservationStatusUpdateService> _logger;

        public VisitReservationStatusUpdateService(IServiceProvider serviceProvider, ILogger<VisitReservationStatusUpdateService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("VisitReservationStatusUpdateService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("VisitReservationStatusUpdateService is running.");

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<CmsContext>();
                        var now = DateTime.UtcNow;

                        // Truy vấn chỉ lấy các bản ghi "Pending" và ngày thăm quan đã qua
                        var reservationsToExpire = await context.VisitRegistrations
                            .Where(vr => vr.Status == "Pending" && vr.VisitDate < now)
                            .ToListAsync(stoppingToken);

                        // Cập nhật trạng thái các bản ghi "Pending" đã qua ngày thăm quan thành "Expired"
                        foreach (var reservation in reservationsToExpire)
                        {
                            reservation.Status = "Expired";
                        }

                        // Lưu các thay đổi vào cơ sở dữ liệu
                        await context.SaveChangesAsync(stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while updating visit reservation statuses.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Điều chỉnh khoảng thời gian khi cần thiết
            }

            _logger.LogInformation("VisitReservationStatusUpdateService is stopping.");
        }
    }
}
