using cms_server.Configuration;
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

                        // Fetch reservations to expire
                        var reservationsToExpire = await context.NicheReservations
                            .Where(nr => (nr.Status == "Pending" || nr.Status == "Approved") && nr.ConfirmationDate.HasValue && nr.ConfirmationDate.Value.Date < now.Date)
                            .Include(nr => nr.Niche) // Include the associated Niche
                            .ToListAsync(stoppingToken);

                        // Update reservation and niche statuses
                        foreach (var reservation in reservationsToExpire)
                        {
                            reservation.Status = "Expired";
                            if (reservation.Niche != null)
                            {
                                reservation.Niche.Status = "Available";
                            }
                        }

                        await context.SaveChangesAsync(stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while updating niche reservation statuses.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }

            _logger.LogInformation("NicheReservationStatusUpdateService is stopping.");
        }
    }
}