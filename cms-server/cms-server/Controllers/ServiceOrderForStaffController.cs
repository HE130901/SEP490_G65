using cms_server.Configuration;
using cms_server.Models;
using cms_server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceOrderForStaffController : ControllerBase
    {
        private readonly CmsContext _context;
        //private readonly INotificationService _notificationService;
// public ServiceOrderForStaffController(CmsContext context, INotificationService notificationService)
        public ServiceOrderForStaffController(CmsContext context)
        {
            _context = context;
          //  _notificationService = notificationService;
        }