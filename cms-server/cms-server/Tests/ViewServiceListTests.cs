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
    public class ServicesControllerTests
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly ServicesController _controller;

        public ServicesControllerTests()
        {
            _mockContext = new Mock<CmsContext>();
            _controller = new ServicesController(_mockContext.Object);
        }

        [Fact]
        public async Task GetServices_ReturnsListOfServices()
        {
            // Arrange
            var services = new List<Service>
            {
                new Service { ServiceId = 1, ServiceName = "Service1", Description = "Description1", Price = 100 },
                new Service { ServiceId = 2, ServiceName = "Service2", Description = "Description2", Price = 200 }
            }.AsQueryable();

            var mockServiceSet = AsyncEnumerableHelper.CreateMockDbSet(services);

            _mockContext.Setup(c => c.Services).Returns(mockServiceSet.Object);

            // Act
            var result = await _controller.GetServices();

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Service>>>(result);
            var returnValue = Assert.IsType<List<Service>>(okResult.Value);

            Assert.Equal(2, returnValue.Count);
            Assert.Equal("Service1", returnValue[0].ServiceName);
            Assert.Equal("Service2", returnValue[1].ServiceName);
        }

        [Fact]
        public async Task GetServices_ReturnsEmptyList()
        {
            // Arrange
            var services = new List<Service>().AsQueryable();

            var mockServiceSet = AsyncEnumerableHelper.CreateMockDbSet(services);

            _mockContext.Setup(c => c.Services).Returns(mockServiceSet.Object);

            // Act
            var result = await _controller.GetServices();

            // Assert
            var okResult = Assert.IsType<ActionResult<IEnumerable<Service>>>(result);
            var returnValue = Assert.IsType<List<Service>>(okResult.Value);

            Assert.Empty(returnValue);
        }
    }
}
