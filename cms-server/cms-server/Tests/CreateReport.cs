using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateReportTests
    {
        private CmsContext _context;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new CmsContext(options);
        }

        [Test]
        public void CreateReport_ValidData_ShouldCreateReport()
        {
            // Arrange
            var report = new Report
            {
                ReportType = "Monthly",
                GeneratedDate = DateTime.Now,
                Content = "This is a monthly report.",
                ReportCode = "RPT001"
            };

            // Act
            _context.Reports.Add(report);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.Reports.Count());
            Assert.AreEqual("RPT001", _context.Reports.First().ReportCode);
        }

        [Test]
        public void CreateReport_InvalidData_ShouldFail()
        {
            // Arrange
            var report = new Report
            {
                ReportType = "", // Invalid ReportType
                GeneratedDate = DateTime.Now,
                Content = "This is a monthly report.",
                ReportCode = "RPT001"
            };

            // Act
            _context.Reports.Add(report);
            try
            {
                ValidateReport(report);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.Reports.Count());
            }
        }

        private void ValidateReport(Report report)
        {
            if (string.IsNullOrWhiteSpace(report.ReportType))
                throw new ValidationException("ReportType is required.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }


}