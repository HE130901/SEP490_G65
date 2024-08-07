﻿using cms_server.Configuration;
using Microsoft.EntityFrameworkCore;

namespace cms_server.Services
{
    public class ContractStatusUpdateService : BackgroundService
    {
        private readonly ILogger<ContractStatusUpdateService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public ContractStatusUpdateService(ILogger<ContractStatusUpdateService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ContractStatusUpdateService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("ContractStatusUpdateService is running.");

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<CmsContext>();
                        var contracts = await context.Contracts.ToListAsync();

                        foreach (var contract in contracts)
                        {
                            if (contract.EndDate.HasValue)
                            {
                                DateTime contractEndDate = contract.EndDate.Value.ToDateTime(TimeOnly.MinValue);
                                DateTime now = DateTime.UtcNow;

                                if (contract.Status == "Active" && (contractEndDate - now).TotalDays <= 30)
                                {
                                    contract.Status = "NearlyExpired";
                                }
                                else if (contract.Status == "NearlyExpired" && contractEndDate <= now)
                                {
                                    contract.Status = "Expired";
                                }
                                // Skip status update for these specific statuses
                                else if (contract.Status == "PendingCancellation" ||
                                         contract.Status == "PendingRenewal" ||
                                         contract.Status == "Extended" ||
                                         contract.Status == "Canceled")
                                {
                                    continue;
                                }
                            }
                        }

                        await context.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while updating contract statuses.");
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }

            _logger.LogInformation("ContractStatusUpdateService is stopping.");
        }
    }
}
