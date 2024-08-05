using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Models;
using System.Security.Claims;
using TimeZoneConverter;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NicheReservationsController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly string timeZoneId = TZConvert.WindowsToIana("SE Asia Standard Time");

      
        public NicheReservationsController(CmsContext context)
        {
            _context = context;
        }
// GET: api/NicheReservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NicheReservationDto>>> GetNicheReservations()
        {
            // Lấy thông tin đơn đặt chỗ
            var reservations = await _context.NicheReservations
                .Include(r => r.Niche)
                    .ThenInclude(n => n.Area)
                        .ThenInclude(a => a.Floor)
                            .ThenInclude(f => f.Building)
                .Select(r => new NicheReservationDto
                {
                    ReservationId = r.ReservationId,
                    ReservationCode = r.ReservationCode,
                    Name = r.Name,
                    PhoneNumber = r.PhoneNumber,
                    NicheAddress = $"{r.Niche.Area.Floor.Building.BuildingName} - {r.Niche.Area.Floor.FloorName} - {r.Niche.Area.AreaName} - {r.Niche.NicheName}",
                    CreatedDate = r.CreatedDate,
                    ConfirmationDate = r.ConfirmationDate,
                    Note = r.Note,
                    Status = r.Status,
                    NicheCode = r.Niche.NicheCode
                })
                .ToListAsync();

            return Ok(reservations);
        }
// GET: api/NicheReservations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NicheReservation>> GetNicheReservation(int id)
        {
            // Lấy thông tin đơn đặt chỗ theo ID
            var nicheReservation = await _context.NicheReservations.FindAsync(id);

            if (nicheReservation == null)
            {
                return NotFound();
            }

            return nicheReservation;
        }