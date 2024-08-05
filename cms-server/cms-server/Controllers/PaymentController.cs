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

 [HttpPost("create-payment")]
        public IActionResult CreatePayment([FromBody] PaymentRequestModel model)
        {
            string amount = (int.Parse(model.Amount) * 100).ToString();
            string orderId = model.OrderId;
            string createDate = DateTime.Now.ToString("yyyyMMddHHmmss");
            string expireDate = DateTime.Now.AddDays(1).ToString("yyyyMMddHHmmss");
var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", _tmnCode);
            vnpay.AddRequestData("vnp_Amount", amount);
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_TxnRef", orderId);
            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang " + orderId);
vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _returnUrl);
            vnpay.AddRequestData("vnp_IpAddr", HttpContext.Connection.RemoteIpAddress?.ToString() ?? "::1");
            vnpay.AddRequestData("vnp_CreateDate", createDate);
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_ExpireDate", expireDate);
