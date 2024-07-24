using cms_server.Models;

namespace cms_server.Services
{
    public class ContractStatusUpdateService : IHostedService, IDisposable
    {
        private Timer _timer;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeZoneInfo _vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

        public ContractStatusUpdateService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // Define the target time (e.g., 2 AM Vietnam time)
            var targetTime = new TimeSpan(2, 0, 0); // 2:00 AM

            // Calculate the initial delay to the next occurrence of the target time
            var now = TimeZoneInfo.ConvertTime(DateTime.Now, _vietnamTimeZone);
            var firstRunTime = new DateTime(now.Year, now.Month, now.Day, targetTime.Hours, targetTime.Minutes, targetTime.Seconds);

            if (now > firstRunTime)
            {
                firstRunTime = firstRunTime.AddDays(1);
            }

            var initialDelay = firstRunTime - now;

            // Set the timer to run daily at the target time
            _timer = new Timer(UpdateContractStatus, null, initialDelay, TimeSpan.FromDays(1));

            return Task.CompletedTask;
        }

        private void UpdateContractStatus(object state)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var _context = scope.ServiceProvider.GetRequiredService<CmsContext>();
                var contracts = _context.Contracts.ToList();

                foreach (var contract in contracts)
                {
                    if (contract.EndDate.HasValue)
                    {
                        var endDate = contract.EndDate.Value.ToDateTime(new TimeOnly(0, 0)); 
                        var daysUntilEnd = (endDate - DateTime.UtcNow).TotalDays;

                        if (daysUntilEnd <= 0)
                        {
                            contract.Status = "Expired";
                        }
                        else if (daysUntilEnd <= 30)
                        {
                            contract.Status = "Nearly Expired";
                        }
                        else
                        {
                            contract.Status = "Active";
                        }

                        _context.Contracts.Update(contract);
                    }
                }

                _context.SaveChanges();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
