using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.Collections.Generic;
using VNPAY_CS_ASPX;

namespace cms_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly string _tmnCode = "JOKFJ07G";
        private readonly string _hashSecret = "77AMDB0XXANRDAIHLHX4GVNK8V9LU74V";
        private readonly string _vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

        // Production return URL
        private readonly string _returnUrl = "https://cms-customer.vercel.app/payment/vnpay_return";

        // Local return URL
        //private readonly string _returnUrl = "http://localhost:3000/payment/vnpay_return";