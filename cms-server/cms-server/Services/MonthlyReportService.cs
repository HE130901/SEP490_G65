using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using cms_server.Models;
using cms_server.Configuration;

public class MonthlyReportService : IHostedService, IDisposable
{
    private Timer _timer;
    private readonly IServiceProvider _serviceProvider;

    public MonthlyReportService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Set the timer to run at the start of each month
        var now = DateTime.Now;
        var firstOfNextMonth = new DateTime(now.Year, now.Month, 1).AddMonths(1);
        var delay = firstOfNextMonth - now;

        _timer = new Timer(DoWork, null, delay, TimeSpan.FromDays(30));
        return Task.CompletedTask;
    }

    private void DoWork(object state)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CmsContext>();
            GenerateMonthlyContractReport(context);
        }
    }

    private void GenerateMonthlyContractReport(CmsContext context)
    {
        var now = DateTime.UtcNow;
        var previousMonthStart = DateOnly.FromDateTime(new DateTime(now.Year, now.Month, 1).AddMonths(-1));
        var previousMonthEnd = previousMonthStart.AddMonths(1);

        // Generate Contract Summary Report for the previous month
        var totalContracts = context.Contracts.Count(c => c.StartDate >= previousMonthStart && c.StartDate < previousMonthEnd);
        var activeContracts = context.Contracts.Count(c => c.Status == "Active" && c.StartDate >= previousMonthStart && c.StartDate < previousMonthEnd);
        var inactiveContracts = context.Contracts.Count(c => c.Status != "Active" && c.StartDate >= previousMonthStart && c.StartDate < previousMonthEnd);
        var totalRevenue = context.Contracts.Where(c => c.StartDate >= previousMonthStart && c.StartDate < previousMonthEnd).Sum(c => c.TotalAmount ?? 0);
        var averageContractValue = totalContracts > 0 ? totalRevenue / totalContracts : 0;

        var contractsByStatus = context.Contracts
            .Where(c => c.StartDate >= previousMonthStart && c.StartDate < previousMonthEnd)
            .GroupBy(c => c.Status)
            .Select(g => new ContractStatusReport
            {
                Status = g.Key,
                Count = g.Count(),
                TotalAmount = Math.Round(g.Sum(c => c.TotalAmount ?? 0))
            })
            .ToList();

        var contractReport = new ContractSummaryReport
        {
            TotalContracts = totalContracts,
            ActiveContracts = activeContracts,
            InactiveContracts = inactiveContracts,
            TotalRevenue = Math.Round(totalRevenue),
            AverageContractValue = Math.Round(averageContractValue),
            ContractsByStatus = contractsByStatus
        };

        SaveReport(context, "Monthly", contractReport, $"BC-{previousMonthStart:yyyyMM}");
    }

    private void SaveReport(CmsContext context, string reportType, object reportContent, string reportCode)
    {
        var report = new Report
        {
            ReportType = reportType,
            GeneratedDate = DateTime.UtcNow,
            Content = JsonConvert.SerializeObject(reportContent),
            ReportCode = reportCode
        };

        context.Reports.Add(report);
        context.SaveChanges();
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
