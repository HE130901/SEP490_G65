using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using cms_server.Models;
using System.Linq;
using cms_server.Configuration;

namespace cms_server.Tests
{
    public class CreateNicheReservationTests
    {
        private CmsContext _context;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<CmsContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new CmsContext(options);
        }

        [Test]
        public void CreateNicheReservation_ValidData_ShouldCreateNicheReservation()
        {
            // Arrange
            var niche = new Niche { NicheName = "Niche 1", AreaId = 1 };

            _context.Niches.Add(niche);
            _context.SaveChanges();

            var nicheReservation = new NicheReservation
            {
                NicheId = niche.NicheId,
                CreatedDate = DateTime.Now,
                ConfirmationDate = null,
                Status = "Pending",
                SignAddress = "123 Main St",
                PhoneNumber = "123-456-7890",
                Note = "Reservation note",
                Name = "John Doe",
                ConfirmedBy = null,
                ReservationCode = "R001"
            };

            // Act
            _context.NicheReservations.Add(nicheReservation);
            var result = _context.SaveChanges();

            // Assert
            Assert.AreEqual(1, result);
            Assert.AreEqual(1, _context.NicheReservations.Count());
            Assert.AreEqual("Pending", _context.NicheReservations.First().Status);
        }

        [Test]
        public void CreateNicheReservation_InvalidData_ShouldFail()
        {
            // Arrange
            var nicheReservation = new NicheReservation
            {
                NicheId = 0, // Invalid NicheId
                CreatedDate = DateTime.Now,
                ConfirmationDate = null,
                Status = "Pending",
                SignAddress = "123 Main St",
                PhoneNumber = "123-456-7890",
                Note = "Reservation note",
                Name = "John Doe",
                ConfirmedBy = null,
                ReservationCode = "R001"
            };

            // Act
            _context.NicheReservations.Add(nicheReservation);
            try
            {
                ValidateNicheReservation(nicheReservation);
                _context.SaveChanges();
                Assert.Fail("Expected validation exception was not thrown.");
            }
            catch (ValidationException)
            {
                // Assert
                Assert.AreEqual(0, _context.NicheReservations.Count());
            }
        }

        private void ValidateNicheReservation(NicheReservation nicheReservation)
        {
            if (!_context.Niches.Any(n => n.NicheId == nicheReservation.NicheId))
                throw new ValidationException("Invalid NicheId.");
        }

        [TearDown]
        public void Teardown()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

  
}