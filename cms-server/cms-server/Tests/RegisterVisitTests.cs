using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace cms_server.Tests
{
    public class VisitRegistrationsControllerTests
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly VisitRegistrationsController _controller;
        private readonly Mock<ILogger<VisitRegistrationsController>> _mockLogger;

        public VisitRegistrationsControllerTests()
        {
            _mockContext = new Mock<CmsContext>();
            _mockLogger = new Mock<ILogger<VisitRegistrationsController>>();
            _controller = new VisitRegistrationsController(_mockContext.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task PostVisitRegistration_CreatesNewVisitRegistration_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var visitRegistrationDto = new VisitRegistrationDto
            {
                CustomerId = 1,
                NicheId = 2,
                VisitDate = DateTime.Now.AddDays(1),
                Note = "Test Note",
                AccompanyingPeople = 3
            };

            var mockVisitRegistrations = new Mock<DbSet<VisitRegistration>>();

            _mockContext.Setup(m => m.VisitRegistrations).Returns(mockVisitRegistrations.Object);

            // Act
            var result = await _controller.PostVisitRegistration(visitRegistrationDto);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<VisitRegistration>(createdAtActionResult.Value);

            Assert.Equal(visitRegistrationDto.CustomerId, returnValue.CustomerId);
            Assert.Equal(visitRegistrationDto.NicheId, returnValue.NicheId);
            Assert.Equal(visitRegistrationDto.VisitDate, returnValue.VisitDate);
            Assert.Equal(visitRegistrationDto.Note, returnValue.Note);
            Assert.Equal(visitRegistrationDto.AccompanyingPeople, returnValue.AccompanyingPeople);
            Assert.Equal("Pending", returnValue.Status);
            Assert.Null(returnValue.ApprovedBy);
            Assert.NotNull(returnValue.CreatedDate);

            _mockContext.Verify(m => m.VisitRegistrations.Add(It.IsAny<VisitRegistration>()), Times.Once);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once);
        }
    }
}
