using cms_server.Models;
using Microsoft.EntityFrameworkCore;

namespace cms_server.Services
{
    public class NicheReservationStatusUpdateService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NicheReservationStatusUpdateService> _logger;

        public NicheReservationStatusUpdateService(IServiceProvider serviceProvider, ILogger<NicheReservationStatusUpdateService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("NicheReservationStatusUpdateService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("NicheReservationStatusUpdateService is running.");

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<CmsContext>();
                        var now = DateTime.UtcNow;

                        var reservationsToExpire = await context.NicheReservations
                        .Where(nr => nr.ConfirmationDate < now && nr.Status != "Đã duyệt" && nr.Status != "Quá hạn")
                        .ToListAsync(stoppingToken);

                        foreach (var reservation in reservationsToExpire)
                        {
                            reservation.Status = "Quá hạn";
                        }

                        await context.SaveChangesAsync(stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while updating niche reservation statuses.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Adjust the interval as needed
            }

            _logger.LogInformation("NicheReservationStatusUpdateService is stopping.");
        }
    }
}
