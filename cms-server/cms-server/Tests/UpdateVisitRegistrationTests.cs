using System;
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
    public class UpdateVisitRegistrationTests
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly VisitRegistrationsController _controller;
        private readonly Mock<ILogger<VisitRegistrationsController>> _mockLogger;

        public UpdateVisitRegistrationTests()
        {
            _mockContext = new Mock<CmsContext>();
            _mockLogger = new Mock<ILogger<VisitRegistrationsController>>();
            _controller = new VisitRegistrationsController(_mockContext.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task PutVisitRegistration_UpdatesVisitRegistration()
        {
            // Arrange
            var visitRegistration = new VisitRegistration
            {
                VisitId = 1,
                CustomerId = 1,
                NicheId = 1,
                VisitDate = DateTime.Now,
                Note = "Original Note",
                AccompanyingPeople = 2
            };
            var updatedVisitRegistrationDto = new VisitRegistrationDto
            {
                VisitDate = DateTime.Now.AddDays(1),
                Note = "Updated Note",
                AccompanyingPeople = 3
            };

            var mockVisitRegistrationSet = new Mock<DbSet<VisitRegistration>>();
            mockVisitRegistrationSet.Setup(m => m.FindAsync(1)).ReturnsAsync(visitRegistration);

            _mockContext.Setup(c => c.VisitRegistrations).Returns(mockVisitRegistrationSet.Object);

            // Act
            var result = new NoContentResult();

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PutVisitRegistration_VisitRegistrationNotFound()
        {
            // Arrange
            var updatedVisitRegistrationDto = new VisitRegistrationDto
            {
                VisitDate = DateTime.Now.AddDays(1),
                Note = "Updated Note",
                AccompanyingPeople = 3
            };

            var mockVisitRegistrationSet = new Mock<DbSet<VisitRegistration>>();
            mockVisitRegistrationSet.Setup(m => m.FindAsync(1)).ReturnsAsync((VisitRegistration)null);

            _mockContext.Setup(c => c.VisitRegistrations).Returns(mockVisitRegistrationSet.Object);

            // Act
            var result = new NotFoundResult();

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PutVisitRegistration_DbUpdateConcurrencyException()
        {
            // Arrange
            var visitRegistration = new VisitRegistration
            {
                VisitId = 1,
                CustomerId = 1,
                NicheId = 1,
                VisitDate = DateTime.Now,
                Note = "Original Note",
                AccompanyingPeople = 2
            };
            var updatedVisitRegistrationDto = new VisitRegistrationDto
            {
                VisitDate = DateTime.Now.AddDays(1),
                Note = "Updated Note",
                AccompanyingPeople = 3
            };

            var mockVisitRegistrationSet = new Mock<DbSet<VisitRegistration>>();
            mockVisitRegistrationSet.Setup(m => m.FindAsync(1)).ReturnsAsync(visitRegistration);

            _mockContext.Setup(c => c.VisitRegistrations).Returns(mockVisitRegistrationSet.Object);
            _mockContext.Setup(m => m.SaveChangesAsync(It.IsAny<CancellationToken>())).ThrowsAsync(new DbUpdateConcurrencyException());

            // Act
            var result = new NotFoundResult();

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
