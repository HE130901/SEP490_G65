using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace cms_server.Tests
{
    public class ServiceOrdersControllerTests3
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly ServiceOrdersController _controller;

        public ServiceOrdersControllerTests3()
        {
            _mockContext = new Mock<CmsContext>();
            _controller = new ServiceOrdersController(_mockContext.Object);
        }



        [Fact]
        public async Task PutServiceOrder_ServiceOrderNotFound_ReturnsNotFound()
        {
            // Arrange
            var serviceOrderId = 1;
            var updateRequest = new UpdateServiceOrderRequest { ServiceOrderId = serviceOrderId, OrderDate = DateTime.Now.AddDays(1) };

            var mockServiceOrderSet = new Mock<DbSet<ServiceOrder>>();
            mockServiceOrderSet.Setup(m => m.FindAsync(serviceOrderId)).ReturnsAsync((ServiceOrder)null);

            _mockContext.Setup(c => c.ServiceOrders).Returns(mockServiceOrderSet.Object);

            // Act
            var result = await _controller.PutServiceOrder(serviceOrderId, updateRequest);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }



        [Fact]
        public async Task PutServiceOrder_InvalidId_ReturnsBadRequest()
        {
            // Arrange
            var serviceOrderId = 1;
            var updateRequest = new UpdateServiceOrderRequest { ServiceOrderId = 2, OrderDate = DateTime.Now.AddDays(1) };

            // Act
            var result = await _controller.PutServiceOrder(serviceOrderId, updateRequest);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }
    }
}
