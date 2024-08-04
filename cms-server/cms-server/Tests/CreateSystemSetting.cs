using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateSystemSettingTests
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
        public void CreateSystemSetting_ValidData_ShouldCreateSystemSetting()
        {
            // Arrange
            var systemSetting = new SystemSetting
            {
                SettingName = "MaxUsers",
                SettingNumber = 100,
                SettingUnit = "Users",
                SettingType = "Integer"
            };

            // Act
            _context.SystemSettings.Add(systemSetting);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.SystemSettings.Count());
            Assert.AreEqual("MaxUsers", _context.SystemSettings.First().SettingName);
        }

        [Test]
        public void CreateSystemSetting_InvalidData_ShouldFail()
        {
            // Arrange
            var systemSetting = new SystemSetting
            {
                SettingName = "", // Invalid SettingName
                SettingNumber = 100,
                SettingUnit = "Users",
                SettingType = "Integer"
            };

            // Act
            _context.SystemSettings.Add(systemSetting);
            try
            {
                ValidateSystemSetting(systemSetting);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.SystemSettings.Count());
            }
        }

        private void ValidateSystemSetting(SystemSetting systemSetting)
        {
            if (string.IsNullOrWhiteSpace(systemSetting.SettingName))
                throw new ValidationException("SettingName is required.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

    
}