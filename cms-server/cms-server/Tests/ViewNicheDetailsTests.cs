using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.DTOs;
using cms_server.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace cms_server.Tests
{
    public class NichesControllerTests
    {
        [Fact]
        public async Task GetNicheDetail_ReturnsOkResult_WithNicheDetail()
        {
            // Arrange
            int nicheId = 1;
            var expectedNicheDetail = new NicheDetailDto
            {
                NicheId = nicheId,
                NicheName = "Test Niche",
                NicheDescription = "Test Description"
            };

            var mockNicheService = new Mock<INicheService>();
            mockNicheService.Setup(service => service.GetNicheDetailAsync(nicheId))
                .ReturnsAsync(expectedNicheDetail);

            var controller = new NichesController(mockNicheService.Object);

            // Act
            var result = await controller.GetNicheDetail(nicheId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedNicheDetail = Assert.IsType<NicheDetailDto>(okResult.Value);
            Assert.Equal(expectedNicheDetail.NicheId, returnedNicheDetail.NicheId);
            Assert.Equal(expectedNicheDetail.NicheName, returnedNicheDetail.NicheName);
            Assert.Equal(expectedNicheDetail.NicheDescription, returnedNicheDetail.NicheDescription);
        }
    }
}