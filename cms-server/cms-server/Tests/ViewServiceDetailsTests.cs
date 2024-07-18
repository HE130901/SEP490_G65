
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace cms_server.Tests
{
    public class ViewServiceDetailsTests
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly ServicesController _controller;

        public ViewServiceDetailsTests()
        {
            _mockContext = new Mock<CmsContext>();
            _controller = new ServicesController(_mockContext.Object);
        }

        [Fact]
        public async Task GetService_ReturnsService()
        {
            // Arrange
            var service = new Service { ServiceId = 1, ServiceName = "Service1", Description = "Description1", Price = 100 };

            var mockServiceSet = new Mock<DbSet<Service>>();
            mockServiceSet.Setup(m => m.FindAsync(1)).ReturnsAsync(service);

            _mockContext.Setup(c => c.Services).Returns(mockServiceSet.Object);

            // Act
            var result = await _controller.GetService(1);

            // Assert
            var okResult = Assert.IsType<ActionResult<Service>>(result);
            var returnValue = Assert.IsType<Service>(okResult.Value);

            Assert.Equal(1, returnValue.ServiceId);
            Assert.Equal("Service1", returnValue.ServiceName);
            Assert.Equal("Description1", returnValue.Description);
            Assert.Equal(100, returnValue.Price);
        }

        [Fact]
        public async Task GetService_ReturnsNotFound()
        {
            // Arrange
            var mockServiceSet = new Mock<DbSet<Service>>();
            mockServiceSet.Setup(m => m.FindAsync(1)).ReturnsAsync((Service)null);

            _mockContext.Setup(c => c.Services).Returns(mockServiceSet.Object);

            // Act
            var result = await _controller.GetService(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
