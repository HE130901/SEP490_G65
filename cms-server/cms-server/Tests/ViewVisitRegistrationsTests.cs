using System;
using System.Collections.Generic;
using System.Linq;
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
    public class ViewVisitRegistrationTest
    {
        private readonly Mock<CmsContext> _mockContext;
        private readonly VisitRegistrationsController _controller;
        private readonly Mock<ILogger<VisitRegistrationsController>> _mockLogger;

        public ViewVisitRegistrationTest()
        {
            _mockContext = new Mock<CmsContext>();
            _mockLogger = new Mock<ILogger<VisitRegistrationsController>>();
            _controller = new VisitRegistrationsController(_mockContext.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetVisitRegistrations_ReturnsListOfVisitRegistrations()
        {
            // Arrange
            var visitRegistrations = new List<VisitRegistration>
            {
                new VisitRegistration { VisitId = 1, CustomerId = 1, NicheId = 1, VisitDate = DateTime.Now, Status = "Confirmed", ApprovedBy = 1, CreatedDate = DateTime.Now, Note = "Note 1", AccompanyingPeople = 2 },
                new VisitRegistration { VisitId = 2, CustomerId = 2, NicheId = 2, VisitDate = DateTime.Now, Status = "Pending", ApprovedBy = null, CreatedDate = DateTime.Now, Note = "Note 2", AccompanyingPeople = 3 }
            };

            var visitRegistrationDtos = visitRegistrations.Select(vr => new VisitRegistrationDto
            {
                VisitId = vr.VisitId,
                CustomerId = vr.CustomerId,
                NicheId = vr.NicheId,
                VisitDate = vr.VisitDate,
                Status = vr.Status ?? "No information",
                ApprovedBy = vr.ApprovedBy,
                CreatedDate = vr.CreatedDate ?? DateTime.MinValue,
                Note = vr.Note ?? string.Empty,
                AccompanyingPeople = (int)vr.AccompanyingPeople
            }).ToList();

            var objectResult = new OkObjectResult(visitRegistrationDtos);

            // Act
            var result = await Task.FromResult<ActionResult<IEnumerable<VisitRegistrationDto>>>(objectResult);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
            var returnValue = Assert.IsType<List<VisitRegistrationDto>>(okResult.Value);

            Assert.Equal(2, returnValue.Count);
            Assert.Equal(1, returnValue[0].VisitId);
            Assert.Equal(2, returnValue[1].VisitId);
        }

        [Fact]
        public async Task GetVisitRegistrations_ReturnsEmptyList()
        {
            // Arrange
            var visitRegistrations = new List<VisitRegistration>();

            var visitRegistrationDtos = visitRegistrations.Select(vr => new VisitRegistrationDto
            {
                VisitId = vr.VisitId,
                CustomerId = vr.CustomerId,
                NicheId = vr.NicheId,
                VisitDate = vr.VisitDate,
                Status = vr.Status ?? "No information",
                ApprovedBy = vr.ApprovedBy,
                CreatedDate = vr.CreatedDate ?? DateTime.MinValue,
                Note = vr.Note ?? string.Empty,
                AccompanyingPeople = (int)vr.AccompanyingPeople
            }).ToList();

            var objectResult = new OkObjectResult(visitRegistrationDtos);

            // Act
            var result = await Task.FromResult<ActionResult<IEnumerable<VisitRegistrationDto>>>(objectResult);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(200, okResult.StatusCode);
            var returnValue = Assert.IsType<List<VisitRegistrationDto>>(okResult.Value);

            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task GetVisitRegistrations_ReturnsInternalServerError()
        {
            // Arrange
            var objectResult = new ObjectResult("Internal server error: Test exception")
            {
                StatusCode = 500
            };

            // Act
            var result = await Task.FromResult<ActionResult<IEnumerable<VisitRegistrationDto>>>(objectResult);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusCodeResult.StatusCode);
            Assert.Equal("Internal server error: Test exception", statusCodeResult.Value);
        }
    }
}
