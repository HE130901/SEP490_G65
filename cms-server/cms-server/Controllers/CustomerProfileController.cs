using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cms_server.Configuration;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerProfileController : ControllerBase
    {
        private readonly CmsContext _context;

        public CustomerProfileController(CmsContext context)
        {
            _context = context;
        }


    }
}