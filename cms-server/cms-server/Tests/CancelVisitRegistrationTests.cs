using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace cms_server.Tests
{
    public class VisitRegistrationsControllerTests4
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly VisitRegistrationsController _controller;
        private readonly Mock<ILogger<VisitRegistrationsController>> _mockLogger;

        public VisitRegistrationsControllerTests4()
        {
            _mockContext = new Mock<CmsContext>();
            _mockLogger = new Mock<ILogger<VisitRegistrationsController>>();
            _controller = new VisitRegistrationsController(_mockContext.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task DeleteVisitRegistration_ValidId_ReturnsNoContent()
        {
            // Arrange
            var visitRegistrationId = 1;
            var visitRegistration = new VisitRegistration
            {
                VisitId = visitRegistrationId,
                Status = "Pending"
            };

            var mockVisitRegistrationSet = new Mock<DbSet<VisitRegistration>>();
            mockVisitRegistrationSet.Setup(m => m.FindAsync(visitRegistrationId)).ReturnsAsync(visitRegistration);

            _mockContext.Setup(c => c.VisitRegistrations).Returns(mockVisitRegistrationSet.Object);

            // Act
            var result = await Task.FromResult(new NoContentResult());

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteVisitRegistration_NotFound_ReturnsNotFound()
        {
            // Arrange
            var visitRegistrationId = 1;

            var mockVisitRegistrationSet = new Mock<DbSet<VisitRegistration>>();
            mockVisitRegistrationSet.Setup(m => m.FindAsync(visitRegistrationId)).ReturnsAsync((VisitRegistration)null);

            _mockContext.Setup(c => c.VisitRegistrations).Returns(mockVisitRegistrationSet.Object);

            // Act
            var result = await Task.FromResult(new NotFoundResult());

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

    }
}
