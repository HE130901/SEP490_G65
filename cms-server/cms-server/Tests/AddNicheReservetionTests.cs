using System;
using System.Threading.Tasks;
using cms_server.Controllers;
using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace cms_server.Tests
{
    public class NicheReservationsControllerTests
    {
        [Fact]
        public async Task PostNicheReservation_CustomerExists_ReturnsCreatedResult()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            // Set up the in-memory database
            using (var context = new CmsContext(options))
            {
                context.Customers.Add(new Customer
                {
                    CustomerId = 1,
                    Phone = "1234567890",
                    Email = "test@example.com",
                    FullName = "Test Customer",
                    PasswordHash = "hashedpassword123" // In a real scenario, use a proper password hashing method
                });

                context.Niches.Add(new Niche
                {
                    NicheId = 1,
                    Status = "Available",
                    NicheName = "Test Niche" // Adding the required NicheName
                });

                await context.SaveChangesAsync();
            }

            // Use a clean instance of the context for the test
            using (var context = new CmsContext(options))
            {
                var controller = new NicheReservationsController(context);

                var createDto = new CreateNicheReservationDto
                {
                    NicheId = 1,
                    Name = "Test",
                    PhoneNumber = "1234567890",
                    SignAddress = "Test Address",
                    ConfirmationDate = DateTime.Now,
                    Note = "Test Note"
                };

                // Act
                var result = await controller.PostNicheReservation(createDto);

                // Assert
                var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
                var returnValue = Assert.IsType<NicheReservation>(createdAtActionResult.Value);
                Assert.Equal(createDto.NicheId, returnValue.NicheId);
                Assert.Equal(createDto.Name, returnValue.Name);
                Assert.Equal(createDto.PhoneNumber, returnValue.PhoneNumber);
                Assert.Equal("Pending", returnValue.Status);

                // Verify that the reservation was added to the database
                var savedReservation = await context.NicheReservations.FirstOrDefaultAsync(r => r.NicheId == createDto.NicheId);
                Assert.NotNull(savedReservation);
                Assert.Equal("Pending", savedReservation.Status);

                // Verify that the niche status was updated
                var updatedNiche = await context.Niches.FindAsync(createDto.NicheId);
                Assert.Equal("Booked", updatedNiche.Status);
            }
        }
    }
}