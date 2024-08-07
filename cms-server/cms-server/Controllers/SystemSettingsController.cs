﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using cms_server.Models;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemSettingsController : ControllerBase
    {
        private readonly CmsContext _context;
        private readonly ILogger<SystemSettingsController> _logger;

        public SystemSettingsController(CmsContext context, ILogger<SystemSettingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<SystemSetting>> GetAllSettings()
        {
            var settings = _context.SystemSettings.ToList();
            return Ok(settings);
        }

        // GET: api/SystemSettings/byType/{settingType}
        [HttpGet("byType/{settingType}")]
        public ActionResult<IEnumerable<SystemSetting>> GetSettingsByType(string settingType)
        {
            var settings = _context.SystemSettings
                .Where(s => s.SettingType == settingType)
                .ToList();

            if (settings == null || settings.Count == 0)
            {
                return NotFound(new { message = "No settings found for the specified type" });
            }

            return Ok(settings);
        }

        // DTO class for the update request
        public class UpdateSettingNumberRequest
        {
            public decimal SettingNumber { get; set; }
        }

        [HttpPatch("{id}")]
        public ActionResult UpdateSettingNumber(int id, [FromBody] UpdateSettingNumberRequest request)
        {
            if (request == null || !ModelState.IsValid)
            {
                _logger.LogWarning("Invalid request body or model state.");
                return BadRequest("Invalid data.");
            }

            try
            {
                var setting = _context.SystemSettings.FirstOrDefault(s => s.SettingId == id);

                if (setting == null)
                {
                    _logger.LogWarning("Setting with ID {Id} not found.", id);
                    return NotFound(new { message = "Setting not found" });
                }

                setting.SettingNumber = request.SettingNumber;

                // Optional: Explicitly setting the state to modified
                _context.Entry(setting).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                _context.SaveChanges();
                return Ok(setting);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error while updating setting with ID {Id}.", id);
                return StatusCode(409, "Concurrency conflict occurred.");
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database update error while updating setting with ID {Id}.", id);
                return StatusCode(500, "An error occurred while updating the setting.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while updating setting with ID {Id}.", id);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }


    }
}
