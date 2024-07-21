using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace cms_server.Tests
{
    public class NichesControllerTests
    {
        private readonly Mock<NicheService> _mockNicheService;
        private readonly NichesController _controller;

        public NichesControllerTests()
        {
            _mockNicheService = new Mock<NicheService>();
            _controller = new NichesController(_mockNicheService.Object);
        }

        [Fact]
        public async Task GetNiches_ReturnsOkResult_WithListOfNicheDto()
        {
            // Arrange
            var customerId = 1;
            var niches = new List<NicheDto>
            {
                new NicheDto { Id = 1, Name = "Niche1" },
                new NicheDto { Id = 2, Name = "Niche2" }
            };
            _mockNicheService.Setup(service => service.GetNichesAsync(customerId))
                .ReturnsAsync(niches);

            // Act
            var result = await _controller.GetNiches(customerId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnNiches = Assert.IsType<List<NicheDto>>(okResult.Value);
            Assert.Equal(2, returnNiches.Count);
        }

        [Fact]
        public async Task GetNicheDetail_ReturnsOkResult_WithNicheDetailDto()
        {
            // Arrange
            var nicheId = 1;
            var nicheDetail = new NicheDetailDto
            {
                Id = nicheId,
                Name = "Niche1",
                Description = "Description1"
            };
            _mockNicheService.Setup(service => service.GetNicheDetailAsync(nicheId))
                .ReturnsAsync(nicheDetail);

            // Act
            var result = await _controller.GetNicheDetail(nicheId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnNicheDetail = Assert.IsType<NicheDetailDto>(okResult.Value);
            Assert.Equal(nicheId, returnNicheDetail.Id);
        }
    }
}
