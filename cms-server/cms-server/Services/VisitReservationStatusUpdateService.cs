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

                        var reservationsToExpire = await context.VisitRegistrations
                            .Where(vr => vr.VisitDate < now  && vr.Status != "Quá hạn")
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
                    _logger.LogError(ex, "An error occurred while updating visit reservation statuses.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Adjust the interval as needed
            }

            _logger.LogInformation("VisitReservationStatusUpdateService is stopping.");
        }
    }
}
